import React, { useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const LOCAL_STORAGE_KEY = 'checkoutAddressData';

const AddressForm = ({
  formData,
  shippingStates,
  billingStates,
  countries,
  onChange,
  onSubmit,
  onClose,
  saving,
  error,
}) => {
  // Save formData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore localStorage errors
    }
  }, [formData]);

  const popupWrapperStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '10px',
  };

  const popupBoxStyle = {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px 15px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '15px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const headingStyle = {
    marginBottom: '10px',
    fontSize: '1.25rem',
    fontWeight: '600',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.9rem',
    fontWeight: '500',
  };

  const inputStyle = {
    marginTop: '6px',
    padding: '8px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
  };

  const checkboxWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
  };

  const errorStyle = {
    color: 'red',
    fontWeight: '600',
    marginTop: '10px',
  };

  const submitBtnStyle = {
    backgroundColor: '#ff5100ff',
    color: '#fff',
    padding: '10px 18px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: saving ? 'not-allowed' : 'pointer',
    opacity: saving ? 0.6 : 1,
    alignSelf: 'flex-start',
  };

  const handlePhoneChange = (phone, section) => {
    onChange({ target: { name: 'phone', value: phone } }, section);
  };

  const renderAddressSection = (section, states) => {
    const title = section.charAt(0).toUpperCase() + section.slice(1);
    return (
      <>
        <h3 style={headingStyle}>{title} Address</h3>
        <div
          style={{
            ...gridStyle,
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          }}
        >
          <label style={labelStyle}>
            Full Name
            <input
              type="text"
              name="fullName"
              value={formData[section].fullName}
              onChange={(e) => onChange(e, section)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Address Line 1
            <input
              type="text"
              name="address1"
              value={formData[section].address1}
              onChange={(e) => onChange(e, section)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Address Line 2
            <input
              type="text"
              name="address2"
              value={formData[section].address2}
              onChange={(e) => onChange(e, section)}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            City
            <input
              type="text"
              name="city"
              value={formData[section].city}
              onChange={(e) => onChange(e, section)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Postal Code
            <input
              type="text"
              name="postalCode"
              value={formData[section].postalCode}
              onChange={(e) => onChange(e, section)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Phone
            <PhoneInput
              country={'ae'}
              value={formData[section].phone}
              onChange={(phone) => handlePhoneChange(phone, section)}
              containerStyle={{
                marginTop: '6px',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                boxSizing: 'border-box',
              }}
              inputStyle={{
                border: 'none',
                width: '100%',
                fontSize: '1rem',
                height: '40px',
                boxShadow: 'none',
                marginLeft: '25px',
              }}
              buttonStyle={{
                border: 'none',
                backgroundColor: '#fff',
              }}
              dropdownStyle={{
                width: '280px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
              enableSearch={true}
              countryCodeEditable={true}
            />
          </label>
          <label style={labelStyle}>
            State / Province
            {states.length > 0 ? (
              <select
                name="state"
                value={formData[section].state}
                onChange={(e) => onChange(e, section)}
                style={selectStyle}
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="state"
                value={formData[section].state}
                onChange={(e) => onChange(e, section)}
                style={inputStyle}
              />
            )}
          </label>
          <label style={labelStyle}>
            Country
            <select
              name="country"
              value={formData[section].country}
              onChange={(e) => onChange(e, section)}
              style={selectStyle}
            >
              <option value="">Select country</option>
              {Object.entries(countries).map(([code, countryData]) => (
                <option key={code} value={code}>
                  {countryData.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </>
    );
  };

  return (
    <div style={popupWrapperStyle}>
      <div style={popupBoxStyle}>
        <button type="button" style={closeBtnStyle} onClick={onClose} aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <form onSubmit={onSubmit} noValidate style={formStyle}>
          {renderAddressSection('shipping', shippingStates)}

          <label style={checkboxWrapperStyle}>
            <input
              type="checkbox"
              name="billingSameAsShipping"
              checked={formData.billingSameAsShipping}
              onChange={(e) => onChange(e, 'checkbox')}
              style={{ cursor: 'pointer' }}
            />
            Same address for billing
          </label>

          {!formData.billingSameAsShipping && renderAddressSection('billing', billingStates)}

          {error && <div style={errorStyle}>{error}</div>}

          <button type="submit" disabled={saving} style={submitBtnStyle}>
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;

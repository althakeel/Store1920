import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const LOCAL_STORAGE_KEY = 'checkoutAddressData';

const UAE_EMIRATES = [
  { code: 'ABU', name: 'Abu Dhabi' },
  { code: 'DXB', name: 'Dubai' },
  { code: 'SHJ', name: 'Sharjah' },
  { code: 'AJM', name: 'Ajman' },
  { code: 'UAQ', name: 'Umm Al Quwain' },
  { code: 'RAK', name: 'Ras Al Khaimah' },
  { code: 'FSH', name: 'Fujairah' },
];

const AddressForm = ({ formData, onChange, onSubmit, onClose, saving, error }) => {
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  useEffect(() => {
    if (!formData.shipping.country) {
      onChange({ target: { name: 'country', value: 'AE' } }, 'shipping');
    }
    if (!formData.shipping.phone) {
      onChange({ target: { name: 'phone', value: '971' } }, 'shipping');
    }
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
      case 'address1':
      case 'city':
      case 'state':
        if (!value || value.trim() === '') error = 'This field is required';
        break;
      case 'phone':
        if (!value || value.length < 9) error = 'Invalid phone number';
        break;
      default:
        break;
    }
    setFormErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(formData.shipping).forEach((field) => {
      const valid = validateField(field, formData.shipping[field]);
      if (!valid) isValid = false;
    });
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(e);
  };

  const handlePhoneChange = (phone) => {
    const normalizedPhone = phone.replace(/^0+/, '');
    onChange({ target: { name: 'phone', value: normalizedPhone } }, 'shipping');
    validateField('phone', normalizedPhone);
  };

  const handleFieldChange = (e) => {
    onChange(e, 'shipping');
    validateField(e.target.name, e.target.value);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '12px',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '25px 30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '22px',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#555',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 style={{ marginBottom: '15px', fontSize: '1.5rem', fontWeight: 700, color: '#333' }}>
          Shipping Address
        </h2>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
            {/* Full Name */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Full Name
              <input
                type="text"
                name="fullName"
                value={formData.shipping.fullName}
                onChange={handleFieldChange}
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  width: '100%',
                  transition: '0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ff5100')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              />
              {formErrors.fullName && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.fullName}</span>}
            </label>

            {/* Address */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Address
              <input
                type="text"
                name="address1"
                value={formData.shipping.address1}
                onChange={handleFieldChange}
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  width: '100%',
                  transition: '0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ff5100')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              />
              {formErrors.address1 && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.address1}</span>}
            </label>

            {/* City / Area */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Area
              <input
                type="text"
                name="city"
                value={formData.shipping.city}
                onChange={handleFieldChange}
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  width: '100%',
                  transition: '0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ff5100')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              />
              {formErrors.city && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.city}</span>}
            </label>

            {/* State */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              State / Province
              <select
                name="state"
                value={formData.shipping.state}
                onChange={handleFieldChange}
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  width: '100%',
                  transition: '0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ff5100')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              >
                <option value="">Select state</option>
                {UAE_EMIRATES.map((state) => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
              {formErrors.state && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.state}</span>}
            </label>

            {/* Phone */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Phone
              <PhoneInput
                country="ae"
                value={formData.shipping.phone || '971'}
                onChange={handlePhoneChange}
                containerStyle={{ width: '100%' }}
                inputStyle={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  paddingLeft: '48px',
                  transition: '0.2s',
                }}
                buttonStyle={{ pointerEvents: 'none', backgroundColor: '#fff' }}
                enableSearch={false}
                countryCodeEditable={false}
                onFocus={() => {}}
              />
              {formErrors.phone && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.phone}</span>}
            </label>

            {/* Country (fixed) */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Country
              <input
                type="text"
                value="United Arab Emirates"
                readOnly
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  width: '100%',
                  backgroundColor: '#f9f9f9',
                  cursor: 'not-allowed',
                }}
              />
            </label>
          </div>

          {error && <div style={{ color: 'red', fontWeight: 600 }}>{error}</div>}

          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: '#ff5100',
              color: '#fff',
              padding: '12px 22px',
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              alignSelf: 'flex-start',
              transition: '0.2s',
            }}
            onMouseOver={(e) => !saving && (e.target.style.backgroundColor = '#e04a00')}
            onMouseOut={(e) => !saving && (e.target.style.backgroundColor = '#ff5100')}
          >
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;

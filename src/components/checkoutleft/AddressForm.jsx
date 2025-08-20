import React, { useEffect, useState } from 'react';
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
  const [formErrors, setFormErrors] = useState({});

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore localStorage errors
    }
  }, [formData]);

  const validateField = (section, name, value) => {
    let error = '';

    switch (name) {
      case 'fullName':
      case 'address1':
      case 'city':
      case 'state':
      case 'country':
      case 'postalCode':
        if (!value || value.trim() === '') error = 'This field is required';
        break;
      case 'phone':
        if (!value || value.length < 9) error = 'Invalid phone number';
        break;
      default:
        break;
    }

    setFormErrors((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: error },
    }));

    return error === '';
  };

  const validateForm = () => {
    const sections = ['shipping'];
    if (!formData.billingSameAsShipping) sections.push('billing');
    let isValid = true;

    sections.forEach((section) => {
      const data = formData[section];
      Object.keys(data).forEach((field) => {
        const valid = validateField(section, field, data[field]);
        if (!valid) isValid = false;
      });
    });

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handlePhoneChange = (phone, section) => {
    onChange({ target: { name: 'phone', value: phone } }, section);
    validateField(section, 'phone', phone);
  };

  const handleFieldChange = (e, section) => {
    onChange(e, section);
    validateField(section, e.target.name, e.target.value);
  };

  const renderAddressSection = (section, states) => {
    const title = section.charAt(0).toUpperCase() + section.slice(1);
    return (
      <>
        <h3 style={{ marginBottom: '10px', fontSize: '1.25rem', fontWeight: 600 }}>
          {title} Address
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
          }}
        >
          {['fullName', 'address1', 'address2', 'city', 'postalCode', 'phone', 'state', 'country'].map((field) => {
            if (field === 'phone') {
              return (
                <label key={field} style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9rem', fontWeight: 500 }}>
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
                    buttonStyle={{ border: 'none', backgroundColor: '#fff' }}
                    dropdownStyle={{ width: '280px', maxHeight: '200px', overflowY: 'auto' }}
                    enableSearch
                    countryCodeEditable
                  />
                  {formErrors[section]?.phone && (
                    <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors[section].phone}</span>
                  )}
                </label>
              );
            }

            if (field === 'state') {
              return (
                <label key={field} style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9rem', fontWeight: 500 }}>
                  State / Province
                  {states.length > 0 ? (
                    <select
                      name="state"
                      value={formData[section].state}
                      onChange={(e) => handleFieldChange(e, section)}
                      style={{ marginTop: '6px', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', appearance: 'none' }}
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
                      onChange={(e) => handleFieldChange(e, section)}
                      style={{ marginTop: '6px', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                    />
                  )}
                  {formErrors[section]?.state && (
                    <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors[section].state}</span>
                  )}
                </label>
              );
            }

            if (field === 'country') {
              return (
                <label key={field} style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9rem', fontWeight: 500 }}>
                  Country
                  <select
                    name="country"
                    value={formData[section].country}
                    onChange={(e) => handleFieldChange(e, section)}
                    style={{ marginTop: '6px', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', appearance: 'none' }}
                  >
                    <option value="">Select country</option>
                    {Object.entries(countries).map(([code, countryData]) => (
                      <option key={code} value={code}>
                        {countryData.name}
                      </option>
                    ))}
                  </select>
                  {formErrors[section]?.country && (
                    <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors[section].country}</span>
                  )}
                </label>
              );
            }

            // All other input fields
            return (
              <label key={field} style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9rem', fontWeight: 500 }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <input
                  type="text"
                  name={field}
                  value={formData[section][field]}
                  onChange={(e) => handleFieldChange(e, section)}
                  style={{ marginTop: '6px', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                />
                {formErrors[section]?.[field] && (
                  <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors[section][field]}</span>
                )}
              </label>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '10px' }}>
      <div style={{ position: 'relative', backgroundColor: '#fff', padding: '20px 15px', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <button type="button" style={{ background: 'transparent', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', position: 'absolute', top: '10px', right: '15px' }} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {renderAddressSection('shipping', shippingStates)}

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
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

          {error && <div style={{ color: 'red', fontWeight: 600, marginTop: '10px' }}>{error}</div>}

          <button type="submit" disabled={saving} style={{ backgroundColor: '#ff5100ff', color: '#fff', padding: '10px 18px', fontSize: '1rem', border: 'none', borderRadius: '5px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, alignSelf: 'flex-start' }}>
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;

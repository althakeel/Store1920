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

const UAE_CITIES = {
  ABU: ['Abu Dhabi', 'Al Ain', 'Madinat Zayed', 'Sweihan', 'Liwa Oasis', 'Ruways', 'Ghayathi', 'Jebel Dhanna'],
  DXB: ['Dubai', 'Deira', 'Bur Dubai', 'Jebel Ali', 'Al Barsha', 'Al Quoz', 'Al Safa', 'Dubai Marina', 'Jumeirah'],
  SHJ: ['Sharjah', 'Al Dhaid', 'Khor Fakkan', 'Kalba', 'Mleiha', 'Al Hamriyah'],
  AJM: ['Ajman', 'Masfout', 'Manama', 'Al Jurf'],
  UAQ: ['Umm Al Quwain', 'Falaj Al Mualla', 'Al Sinniyah'],
  RAK: ['Ras Al Khaimah', 'Dibba Al-Hisn', 'Khatt'],
  FSH: ['Fujairah', 'Dibba Al-Fujairah', 'Khor Fakkan'],
};

const AddressForm = ({ formData, onChange, onSubmit, onClose, saving, error, cartItems }) => {
  const [formErrors, setFormErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);


  // -----------------------------
  // Load saved address from localStorage
  // -----------------------------
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.shipping) {
          Object.keys(data.shipping).forEach((key) =>
            onChange({ target: { name: key, value: data.shipping[key] } }, 'shipping')
          );
        }
        if (data.saveAsDefault !== undefined) {
          onChange({ target: { name: 'saveAsDefault', value: data.saveAsDefault } });
        }
      } catch (err) {
        console.warn('Failed to parse saved checkout address:', err);
      }
    }
  }, [onChange]);

  // -----------------------------
  // Field validation
  // -----------------------------
const validateField = (name, value) => {
  switch (name) {
    case 'first_name':
    case 'last_name':
    case 'street':
    case 'city':
    case 'state':
      if (!value || value.trim() === '') return 'This field is required';
      break;
    case 'phone_number':
      if (!value || value.length < 12) return 'Invalid phone number';
      break;
    case 'email':
      if (value && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email'; // validate only if filled
      break;
    default:
      return '';
  }
  return '';
};

 const validateForm = () => {
  const errors = {};
  const requiredFields = ['first_name', 'last_name', 'phone_number', 'street', 'state', 'city']; // removed email
  requiredFields.forEach((field) => {
    const errorMsg = validateField(field, formData.shipping[field]);
    if (errorMsg) errors[field] = errorMsg;
  });
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};


  // -----------------------------
  // Handle input changes
  // -----------------------------
  const handleFieldChange = (e) => {
    onChange(e, 'shipping');
    const errorMsg = validateField(e.target.name, e.target.value);
    setFormErrors((prev) => ({ ...prev, [e.target.name]: errorMsg }));
  };

  const handlePhoneChange = (phone) => {
    const normalizedPhone = phone.replace(/^0+/, '');
    onChange({ target: { name: 'phone_number', value: normalizedPhone } }, 'shipping');
    const errorMsg = validateField('phone_number', normalizedPhone);
    setFormErrors((prev) => ({ ...prev, phone_number: errorMsg }));
  };

  // -----------------------------
  // OTP handlers
  // -----------------------------
  const sendOtp = async () => {
    if (!formData.shipping.phone_number) {
      alert('Enter a valid phone number first');
      return;
    }
    try {
      setOtpLoading(true);
      const res = await fetch('https://store1920.com/wp-json/custom/v1/send-whatsapp-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.shipping.phone_number }),
      });
      const data = await res.json();
      setOtpLoading(false);
      if (data.success) {
        alert('OTP sent to your WhatsApp!');
        setOtpSent(true);
      } else {
        alert('Failed to send OTP');
      }
    } catch (err) {
      setOtpLoading(false);
      console.error(err);
      alert('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      setOtpLoading(true);
      const res = await fetch('https://store1920.com/wp-json/custom/v1/verify-whatsapp-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.shipping.phone_number, otp }),
      });
      const data = await res.json();
      setOtpLoading(false);
      if (data.success) {
        alert('Phone verified!');
        setOtpVerified(true);
      } else {
        alert('Invalid OTP, try again.');
        setOtpVerified(false);
      }
    } catch (err) {
      setOtpLoading(false);
      console.error(err);
      alert('Error verifying OTP');
    }
  };

  // -----------------------------
  // Save address
  // -----------------------------
const saveAddress = async (e) => {
  e.preventDefault();
  setSubmitAttempted(true); // mark that user tried to save

  const isValid = validateForm();
  if (!isValid) {
    // Scroll to first error field
    const firstErrorField = Object.keys(formErrors)[0];
    const fieldElement = document.getElementsByName(firstErrorField)[0];
    if (fieldElement) {
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldElement.focus();
    }
    return; // stop submission
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));

    const payload = {
      ...formData,
      cart: cartItems?.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
    };

    const res = await fetch('https://db.store1920.com/wp-json/abandoned-checkout/v1/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Saved to WordPress:', result);

    onSubmit(formData);
  } catch (err) {
    console.error('Failed to save to WordPress', err);
    alert('Something went wrong while saving your address.');
  }
};


  // -----------------------------
  // JSX
  // -----------------------------
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
          background: '#fff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '25px 30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
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
        >
          ✕
        </button>

        <h2 style={{ marginBottom: '15px', fontSize: '1.5rem', fontWeight: 700, color: '#333' }}>
          Shipping Address
        </h2>

        <form onSubmit={saveAddress} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Display form errors */}
    {submitAttempted && Object.keys(formErrors).length > 0 && (
  <div
    style={{
      backgroundColor: '#ffe5e5',
      border: '1px solid #ff4d4f',
      color: '#a80000',
      padding: '12px 16px',
      borderRadius: '8px',
      fontWeight: 500,
    }}
  >
    <strong>Please fix the following fields in order:</strong>
    <ol style={{ margin: 0, paddingLeft: '18px' }}>
      {Object.entries(formErrors).map(([field, msg]) => (
        <li key={field}>
          {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {msg}
        </li>
      ))}
    </ol>
  </div>
)}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
            {/* First Name */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              First Name
              <input
                type="text"
                name="first_name"
                value={formData.shipping.first_name}
                onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.first_name && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.first_name}</span>}
            </label>

            {/* Last Name */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Last Name
              <input
                type="text"
                name="last_name"
                value={formData.shipping.last_name}
                onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.last_name && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.last_name}</span>}
            </label>

            {/* Email */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Email
              <input
                type="email"
                name="email"
                value={formData.shipping.email}
                onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.email && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.email}</span>}
            </label>

            {/* Phone */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444', gap: 5 }}>
              Phone Number
              <PhoneInput
                country="ae"
                value={formData.shipping.phone_number || '971'}
                onChange={handlePhoneChange}
                containerStyle={{ width: '100%' }}
                inputStyle={{ width: '100%', height: '42px', borderRadius: '6px', border: '1px solid #ccc', paddingLeft: '48px' }}
                buttonStyle={{ pointerEvents: 'none', backgroundColor: '#fff' }}
                enableSearch={false}
                countryCodeEditable={false}
              />
              {formErrors.phone_number && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.phone_number}</span>}
            </label>

            {/* Street */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Street
              <input
                type="text"
                name="street"
                value={formData.shipping.street}
                onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.street && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.street}</span>}
            </label>

            {/* Apartment / Floor */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Apartment / Floor
              <input
                type="text"
                name="apartment"
                value={formData.shipping.apartment}
                onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </label>

            {/* Emirates */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Province / Emirates
              <select
                name="state"
                value={formData.shipping.state}
                onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="">Select state</option>
                {UAE_EMIRATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {formErrors.state && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.state}</span>}
            </label>

            {/* City */}
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              City / Area
              <select
                name="city"
                value={formData.shipping.city}
                onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="">Select city</option>
                {UAE_CITIES[formData.shipping.state]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {formErrors.city && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.city}</span>}
            </label>

            {/* Country */}
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
                  backgroundColor: '#f9f9f9',
                }}
              />
            </label>
          </div>

          {/* Save as default */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500, color: '#444' }}>
            <input
              type="checkbox"
              name="saveAsDefault"
              checked={formData.saveAsDefault || false}
              onChange={(e) => onChange({ target: { name: 'saveAsDefault', value: e.target.checked } })}
            />
            Save this address as default for future orders
          </label>

          {error && <div style={{ color: 'red', fontWeight: 600 }}>{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            onMouseEnter={validateForm}
            style={{
              backgroundColor: '#ff5100',
              color: '#fff',
              padding: '12px 22px',
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {saving && (
              <div
                style={{
                  border: '2px solid #fff',
                  borderTop: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            )}
            {saving ? 'Saving...' : 'Save Address'}
          </button>

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;

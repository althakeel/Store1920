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
  ABU: [
    'Abu Dhabi', 'Al Ain', 'Madinat Zayed', 'Sweihan', 'Liwa Oasis', 'Ruways', 'Ghayathi', 'Jebel Dhanna',
    'Al Yahar', 'Al Khazna', 'Al Mahdar', 'Al Falah', 'Al Shuwaib', 'Al Rafaah', 'Al Salamah', 'Al Hayer',
    'Al Khari', 'Al Ghashban', 'Al Ghabah', 'Al Fara\'', 'Al Fulayyah', 'Al Awdah', 'Al Ghabam', 'Al Hamraniyah',
    'Al Hamriyah', 'Al Haybah', 'Al Hayl', 'Al Hayr', 'Al Hayrah', 'Al Hulaylah', 'Al Jaddah', 'Al Khashfah',
    'Al Mahamm', 'Al Masafirah', 'Al Mataf', 'Al Mu\'amurah', 'Al Naslah', 'Al Qir', 'Al Quwayz', 'Al Usayli',
    'Khalifa City', 'Shakhbout City', 'Corniche', 'Mussafah', 'Reem Island', 'Yas Island', 'Saadiyat Island'
  ],
  DXB: [
    'Dubai', 'Deira', 'Bur Dubai', 'Jebel Ali', 'Al Barsha', 'Al Quoz', 'Al Safa', 'Dubai Marina', 'Jumeirah',
    'Satwa', 'Al Karama', 'Al Nahda', 'Al Qusais', 'Al Rashidiya', 'Al Jaddaf', 'Al Khawaneej', 'Al Warqa',
    'Al Muhaisnah', 'Al Mizhar', 'Al Garhoud', 'Al Satwa', 'Business Bay', 'Mirdif', 'Jumeirah Beach Residences',
    'International City', 'Discovery Gardens', 'Dubai Silicon Oasis', 'Dubai Investment Park', 'Dubai Festival City',
    'Downtown Dubai', 'Palm Jumeirah', 'Jumeirah Lakes Towers (JLT)', 'DIFC', 'Emirates Towers', 'Trade Centre 2',
    'Sheikh Zayed Road', 'Al Sufouh', 'Dubai Sports City', 'Dubai Hills Estate', 'Al Barsha South', 'Dubai Industrial City'
  ],
  SHJ: [
    'Sharjah', 'Al Dhaid', 'Khor Fakkan', 'Kalba', 'Mleiha', 'Al Hamriyah', 'Al Madam', 'Al Bataeh',
    'Al Khan', 'Al Layyah', 'Al Yarmook', 'Industrial Area', 'Sharjah City Center', 'University City', 'Al Nahda'
  ],
  AJM: [
    'Ajman', 'Masfout', 'Manama', 'Al Jurf', 'Al Rashidiya', 'Al Nuaimia', 'Al Rawda', 'Al Rumailah',
    'Al Mowaihat', 'Al Tallah', 'Al Sheikh Maktoum', 'Al Hamidiyah'
  ],
  UAQ: [
    'Umm Al Quwain', 'Falaj Al Mualla', 'Al Sinniyah', 'Al Rumailah', 'Al Kharran', 'Al Jurf', 'Al Rahbah',
    'Al Raas', 'Al Tallah', 'Al Bu Falah', 'Al Qawasim'
  ],
  RAK: [
    'Ras Al Khaimah', 'Dibba Al-Hisn', 'Khatt', 'Al Jazirah Al Hamra', 'Al Rams', 'Dhayah', 'Ghalilah',
    'Al Nakheel', 'Al Hamra Village', 'Al Nakheel Industrial', 'Al Qusaidat', 'Al Maarid', 'Al Hudaibah'
  ],
  FSH: [
    'Fujairah', 'Dibba Al-Fujairah', 'Khor Fakkan', 'Masafi', 'Bidiyah', 'Dibba Al-Hisn', 'Al Aqah',
    'Al Bithnah', 'Al Faseel', 'Al Hala', 'Al Madhah', 'Al Sharqiyah', 'Al Sakamkam', 'Al Twar', 'Al Jurf'
  ]
};


const AddressForm = ({ formData, onChange, onSubmit, onClose, saving, error }) => {
  const [formErrors, setFormErrors] = useState({});

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  useEffect(() => {
    if (!formData.shipping.country) {
      onChange({ target: { name: 'country', value: 'AE' } }, 'shipping');
    }
    if (!formData.shipping.phone_number) {
      onChange({ target: { name: 'phone_number', value: '971' } }, 'shipping');
    }
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'first_name':
      case 'last_name':
      case 'street':
      case 'city':
      case 'state':
        if (!value || value.trim() === '') error = 'This field is required';
        break;
      case 'phone_number':
        if (!value || value.length < 9) error = 'Invalid phone number';
        break;
      case 'email':
        if (!value || !/\S+@\S+\.\S+/.test(value)) error = 'Invalid email';
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
    if (!validateForm()) return;

    const preparedData = {
      ...formData,
      shipping: {
        ...formData.shipping,
        postal_code: '00000', 
      },
    };

    

    onSubmit(preparedData);
  };

  const handlePhoneChange = (phone) => {
    const normalizedPhone = phone.replace(/^0+/, '');
    onChange({ target: { name: 'phone_number', value: normalizedPhone } }, 'shipping');
    validateField('phone_number', normalizedPhone);
  };

  const handleFieldChange = (e) => {
    onChange(e, 'shipping');
    validateField(e.target.name, e.target.value);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, padding: '12px'
    }}>
      <div style={{
        position: 'relative', background: '#fff', borderRadius: '12px',
        width: '100%', maxWidth: '650px', maxHeight: '90vh',
        overflowY: 'auto', padding: '25px 30px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '20px',
          background: 'none', border: 'none', fontSize: '22px',
          fontWeight: 600, cursor: 'pointer', color: '#555'
        }}>✕</button>

        <h2 style={{ marginBottom: '15px', fontSize: '1.5rem', fontWeight: 700, color: '#333' }}>
          Shipping Address
        </h2>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              First Name
              <input type="text" name="first_name" value={formData.shipping.first_name} onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.first_name && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.first_name}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Last Name
              <input type="text" name="last_name" value={formData.shipping.last_name} onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.last_name && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.last_name}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Email
              <input type="email" name="email" value={formData.shipping.email} onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.email && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.email}</span>}
            </label>

                 <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444',gap:5 }}>
              Phone Number
              <PhoneInput country="ae" value={formData.shipping.phone_number || '971'} onChange={handlePhoneChange}
                containerStyle={{ width: '100%' }}
                inputStyle={{ width: '100%', height: '42px', borderRadius: '6px', border: '1px solid #ccc', paddingLeft: '48px'}}
                buttonStyle={{ pointerEvents: 'none', backgroundColor: '#fff' }}
                enableSearch={false} countryCodeEditable={false}
              />
              {formErrors.phone_number && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.phone_number}</span>}
            </label>


            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Street
              <input type="text" name="street" value={formData.shipping.street} onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              {formErrors.street && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.street}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Apartment / Floor
              <input type="text" name="apartment" value={formData.shipping.apartment} onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </label>
                <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Province / Emirates
              <select name="state" value={formData.shipping.state} onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="">Select state</option>
                {UAE_EMIRATES.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
              </select>
              {formErrors.state && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.state}</span>}
            </label>
<label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
  City / Area 
  <select
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
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    <option value="">Select city</option>
    {UAE_CITIES[formData.shipping.state]?.map((city) => (
      <option key={city} value={city}>{city}</option>
    ))}
  </select>
  {formErrors.city && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.city}</span>}
</label>


        
{/* 
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Postal Code
              <input type="text" name="postal_code" value={formData.shipping.postal_code} onChange={handleFieldChange}
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </label> */}

       
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#444' }}>
              Country
              <input type="text" value="United Arab Emirates" readOnly
                style={{ marginTop: '6px', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} />
            </label>
          </div>

          {error && <div style={{ color: 'red', fontWeight: 600 }}>{error}</div>}

          <button type="submit" disabled={saving}
            style={{ backgroundColor: '#ff5100', color: '#fff', padding: '12px 22px', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;

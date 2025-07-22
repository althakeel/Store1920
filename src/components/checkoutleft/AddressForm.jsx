// src/components/checkoutleft/AddressForm.jsx
import React from 'react';

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
  // Render address fields for shipping or billing
  const renderAddressSection = (section, states) => {
    const title = section.charAt(0).toUpperCase() + section.slice(1);
    return (
      <>
        <h3 className="addrf-heading">{title} Address</h3>
        <div className="addrf-grid">
          <label className="addrf-label">
            Full Name
            <input
              type="text"
              name="fullName"
              value={formData[section].fullName}
              onChange={e => onChange(e, section)}
              required
              className="addrf-input"
            />
          </label>
          <label className="addrf-label">
            Address Line 1
            <input
              type="text"
              name="address1"
              value={formData[section].address1}
              onChange={e => onChange(e, section)}
              required
              className="addrf-input"
            />
          </label>
          <label className="addrf-label">
            Address Line 2
            <input
              type="text"
              name="address2"
              value={formData[section].address2}
              onChange={e => onChange(e, section)}
              className="addrf-input"
            />
          </label>
          <label className="addrf-label">
            City
            <input
              type="text"
              name="city"
              value={formData[section].city}
              onChange={e => onChange(e, section)}
              required
              className="addrf-input"
            />
          </label>
          <label className="addrf-label">
            Postal Code
            <input
              type="text"
              name="postalCode"
              value={formData[section].postalCode}
              onChange={e => onChange(e, section)}
              required
              className="addrf-input"
            />
          </label>
          <label className="addrf-label">
            Phone
            <input
              type="tel"
              name="phone"
              value={formData[section].phone}
              onChange={e => onChange(e, section)}
              required
              className="addrf-input"
            />
          </label>
          <label className="addrf-label">
            State / Province
            {states.length > 0 ? (
              <select
                name="state"
                value={formData[section].state}
                onChange={e => onChange(e, section)}
                className="addrf-select"
              >
                <option value="">Select state</option>
                {states.map(state => (
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
                onChange={e => onChange(e, section)}
                className="addrf-input"
              />
            )}
          </label>
          <label className="addrf-label">
            Country
            <select
              name="country"
              value={formData[section].country}
              onChange={e => onChange(e, section)}
              className="addrf-select"
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
    <div className="addrf-popup-wrapper">
      <div className="addrf-popup-box">
        <button type="button" className="addrf-close-btn" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={onSubmit} noValidate className="addrf-form">
          {renderAddressSection('shipping', shippingStates)}

          <label className="addrf-checkbox-wrapper">
            <input
              type="checkbox"
              name="billingSameAsShipping"
              checked={formData.billingSameAsShipping}
              onChange={e => onChange(e, 'checkbox')}
              className="addrf-checkbox"
            />
            Same address for billing
          </label>

          {!formData.billingSameAsShipping && renderAddressSection('billing', billingStates)}

          {error && <div className="addrf-error">{error}</div>}

          <button type="submit" disabled={saving} className="addrf-submit-btn">
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;

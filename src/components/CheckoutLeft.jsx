// CheckoutLeft.jsx
import React, { useState, useEffect } from 'react';
import '../assets/styles/checkoutleft.css';
import SignInModal from './sub/SignInModal';
import HelpText from './HelpText';
import { auth } from '../utils/firebase';
import PaymentMethods from '../components/checkoutleft/PaymentMethods';
import AddressForm from '../components/checkoutleft/AddressForm';
import ItemList from './checkoutleft/ItemList';

const CheckoutLeft = ({ formData, onChange, countries, cartItems }) => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [shippingStates, setShippingStates] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) setShowForm(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch shipping methods for zone 0
  useEffect(() => {
    fetch(
      'https://store1920.com/wp-json/wc/v3/shipping/zones/0/methods?consumer_key=ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8&consumer_secret=cs_c65538cff741bd9910071c7584b3d070609fec24'
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setShippingMethods)
      .catch(() => setShippingMethods([]));
  }, []);

  // Fetch shipping states when shipping country changes
  useEffect(() => {
    const country = formData.shipping.country;
    if (!country) {
      setShippingStates([]);
      return;
    }

    fetch(
      `https://store1920.com/wp-json/wc/v3/data/states/${country}?consumer_key=ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8&consumer_secret=cs_c65538cff741bd9910071c7584b3d070609fec24`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setShippingStates)
      .catch(() => setShippingStates([]));
  }, [formData.shipping.country]);

  // Fetch billing states when billing country changes (if billing is not same as shipping)
  useEffect(() => {
    if (formData.billingSameAsShipping) {
      setBillingStates([]);
      return;
    }
    const country = formData.billing.country;
    if (!country) {
      setBillingStates([]);
      return;
    }

    fetch(
      `https://store1920.com/wp-json/wc/v3/data/states/${country}?consumer_key=ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8&consumer_secret=cs_c65538cff741bd9910071c7584b3d070609fec24`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setBillingStates)
      .catch(() => setBillingStates([]));
  }, [formData.billing.country, formData.billingSameAsShipping]);

  // Toggle address form or show sign-in modal if not logged in
  const handleAddAddressClick = () => {
    if (user) {
      setShowForm((prev) => !prev);
      setSaveSuccess(false);
      setError(null);
    } else {
      setShowSignInModal(true);
    }
  };

  // Submit address form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    const payload = {
      shipping: formData.shipping,
      billing: formData.billingSameAsShipping ? formData.shipping : formData.billing,
      billingSameAsShipping: formData.billingSameAsShipping,
    };

    try {
      const res = await fetch('https://store1920.com/wp-json/custom/v1/save-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      await res.json();
      setSaveSuccess(true);
      setShowForm(false);
    } catch {
      setError('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="checkout-left">
      <div className="shipping-container">
        <div className="section-block">
          <div className="section-header">
            <h2 className="shippingadress">Shipping Address</h2>
            <button onClick={handleAddAddressClick} className="btn-add-address">
              {showForm ? 'Cancel' : 'Change Address'}
            </button>
          </div>
          {saveSuccess && <div className="success-message">Address saved successfully!</div>}
        </div>

        <div className="section-block shipping-method-block">
          <h2 className="shippingmethod">Shipping Method</h2>
          {shippingMethods.length > 0 ? (
            shippingMethods.map((method) => (
              <div key={method.id} className="shipping-method">
                <p>
                  <strong>{method.title}</strong>:{' '}
                  {method.settings?.cost?.value === '0' || !method.settings?.cost?.value
                    ? 'FREE'
                    : `${method.settings.cost.value} AED`}
                </p>
                {method.description && <p>{method.description}</p>}
              </div>
            ))
          ) : (
            <p>No shipping methods found for this zone.</p>
          )}
        </div>
      </div>

      <div className="section-block">
        <ItemList items={cartItems} />
      </div>

      <div className="section-block">
        <PaymentMethods onMethodSelect={(method) => console.log('Selected:', method)} />
      </div>

      <HelpText />

      <SignInModal
        isOpen={!user && showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onLogin={() => {
          setShowSignInModal(false);
          setShowForm(true);
          setSaveSuccess(false);
          setError(null);
        }}
      />

      {showForm && (
        <AddressForm
          formData={formData}
          shippingStates={shippingStates}
          billingStates={billingStates}
          countries={countries}
          onChange={onChange}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
};

export default CheckoutLeft;

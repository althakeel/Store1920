import React, { useState, useEffect } from 'react';
import '../assets/styles/checkoutleft.css';
import SignInModal from './sub/SignInModal';
import HelpText from './HelpText';
import { auth } from '../utils/firebase';
import PaymentMethods from '../components/checkoutleft/PaymentMethods';
import AddressForm from '../components/checkoutleft/AddressForm';
import ItemList from './checkoutleft/ItemList';
import ShippingMethods from './checkout/ShippingMethods';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CONSUMER_SECRET = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const CheckoutLeft = ({
  formData,
  onChange,
  countries,
  cartItems,
  onRemoveItem,
  onPaymentMethodSelect,
}) => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [shippingStates, setShippingStates] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(null);




const handleDeleteAddress = () => {
  // Clear shipping info (you can customize fields to clear)
  const emptyAddress = {
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  };

  // Reset shipping method
  setSelectedShippingMethodId(null);

  // Call onChange multiple times or create a single "clearShipping" event
  onChange(
    {
      target: {
        name: 'shipping',
        value: emptyAddress,
        type: 'object', // you can define this as you handle in your onChange
      },
    },
    'shipping'
  );

  // Also reset billing if same as shipping is false
  if (!formData.billingSameAsShipping) {
    onChange(
      {
        target: {
          name: 'billing',
          value: emptyAddress,
          type: 'object',
        },
      },
      'billing'
    );
  }
};


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) setShowForm(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRemoveItem = (itemId) => {
    if (onRemoveItem) onRemoveItem(itemId);
  };

  useEffect(() => {
    const country = formData.shipping.country;
    if (!country) return setShippingStates([]);

    fetch(
      `${API_BASE}/data/states/${country}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then(setShippingStates)
      .catch(() => setShippingStates([]));
  }, [formData.shipping.country]);

  useEffect(() => {
    if (formData.billingSameAsShipping) return setBillingStates([]);
    const country = formData.billing.country;
    if (!country) return setBillingStates([]);

    fetch(
      `${API_BASE}/data/states/${country}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then(setBillingStates)
      .catch(() => setBillingStates([]));
  }, [formData.billing.country, formData.billingSameAsShipping]);


  useEffect(() => {
  setSelectedShippingMethodId(formData.shippingMethodId || null);
}, [formData.shippingMethodId]);



  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const zonesRes = await fetch(
          `https://db.store1920.com/wp-json/custom/v1/shipping-zones`
        );
        const zones = await zonesRes.json();

        const countryCode = formData.shipping.country?.toUpperCase() || '';
        const match = zones.find((zone) =>
          zone.locations.some(
            (loc) => loc.code.toUpperCase() === countryCode
          )
        );

        if (!match) {
          setShippingMethods([]);
          return;
        }

        const methodsRes = await fetch(
          `https://db.store1920.com/wp-json/custom/v1/shipping-zones/${match.id}/methods`
        );

        const methods = await methodsRes.json();

        setShippingMethods(methods);
      } catch (err) {
        console.error('Error fetching shipping methods:', err);
        setShippingMethods([]);
      }
    };

    if (formData.shipping.country) {
      fetchShippingMethods();
    } else {
      setShippingMethods([]);
    }
  }, [formData.shipping.country]);

  // NEW handler: mocks event object to conform with onChange
  const handleShippingMethodChange = (id) => {
    onChange(
      {
        target: {
          name: 'shippingMethodId',
          value: id,
          type: 'radio',
        },
      },
      'shipping'
    );
  };

  const handleAddAddressClick = () => {
    setShowForm((prev) => !prev);
    setSaveSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    const payload = {
      shipping: formData.shipping,
      billing: formData.billingSameAsShipping
        ? formData.shipping
        : formData.billing,
      billingSameAsShipping: formData.billingSameAsShipping,
      shippingMethodId: formData.shippingMethodId || null,
    };

    if (user) payload.userId = user.uid;

    try {
      const res = await fetch(
        'https://db.store1920.com/wp-json/custom/v1/save-address',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Failed to save');
      await res.json();
      setSaveSuccess(true);
      setShowForm(false);
      setTimeout(() => setSaveSuccess(false), 3000);
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
          <h2 className="shippingadress" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span>Shipping Address</span>
  <div style={{ display: 'flex', gap: '0px', alignItems: 'center' }}>
    <button
      onClick={handleAddAddressClick}
      className={`btn-add-address1 ${showForm ? 'cancel-btn1' : ''}`}
    >
      {showForm
        ? 'Cancel'
        : formData?.shipping?.address1
        ? 'Change Address'
        : 'Add New Address'}
    </button>

    {formData?.shipping?.address1 && !showForm && (
      <button
        onClick={handleDeleteAddress}
        className="btn-delete-address"
        style={{
          backgroundColor: 'transparent',
          color: '#000',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          textDecoration: 'underline',
        }}
        aria-label="Delete Address"
        title="Delete Address"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-2 14H7L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    )}
  </div>
</h2>


            {/* Saved address summary */}
            {formData?.shipping && formData.shipping.address1 && (
              <div className="saved-address-box">
                <div className="saved-address-grid">
                  <div className="saved-address-label">Name</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {formData.shipping.fullName}
                  </div>

                  <div className="saved-address-label">Address</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {formData.shipping.address1}
                  </div>

                  {/* Uncomment if you want Address 2 */}
                  {/* {formData.shipping.address2 && (
                    <>
                      <div className="saved-address-label">Address 2</div>
                      <div className="saved-address-colon">:</div>
                      <div className="saved-address-value">
                        {formData.shipping.address2}
                      </div>
                    </>
                  )} */}

                  <div className="saved-address-label">City</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {formData.shipping.city}
                  </div>

                  <div className="saved-address-label">State</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {formData.shipping.state}
                  </div>

                  <div className="saved-address-label">Postal Code</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {formData.shipping.postalCode}
                  </div>

                  <div className="saved-address-label">Country</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {countries[formData.shipping.country]?.name ||
                      formData.shipping.country}
                  </div>
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>

     <ShippingMethods
  countryCode={formData.shipping.country?.toUpperCase() || 'AE'}
  selectedMethodId={selectedShippingMethodId}
  onSelect={(id) => {
    setSelectedShippingMethodId(id);
    handleShippingMethodChange(id);
  }}
/>

      <div className="section-block">
        <ItemList items={cartItems} onRemove={handleRemoveItem} />
      </div>

      <div className="section-block">
        <PaymentMethods onMethodSelect={onPaymentMethodSelect} />
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

      {saveSuccess && <div className="addrf-toast">✅ Address saved successfully!</div>}
    </div>
  );
};

export default CheckoutLeft;

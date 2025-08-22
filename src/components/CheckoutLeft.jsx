import React, { useState, useEffect } from 'react';
import '../assets/styles/checkoutleft.css';
import SignInModal from './sub/SignInModal';
import HelpText from './HelpText';
import { auth } from '../utils/firebase';
import PaymentMethods from '../components/checkoutleft/PaymentMethods';
import AddressForm from '../components/checkoutleft/AddressForm';
import ItemList from './checkoutleft/ItemList';
import ShippingMethods from '../components/checkout/ShippingMethods';
import emptyAddressImg from '../assets/images/adress-not-found.png';
import DeleteIcon from '../assets/images/Delete-icon.png';
import ProductsUnder20AED from './ProductsUnder20AED';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CONSUMER_SECRET = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const getLocalStorageKey = (userId) => `checkoutAddressData_${userId || 'guest'}`;

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
  const [methodsByZone, setMethodsByZone] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(null);

  // Load saved formData from localStorage per user on user change
  useEffect(() => {
    if (!user) return;
    try {
      const saved = localStorage.getItem(getLocalStorageKey(user.uid));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.shipping) {
          onChange({ target: { name: 'shipping', value: parsed.shipping, type: 'object' } }, 'shipping');
        }
        if (parsed.billing) {
          onChange({ target: { name: 'billing', value: parsed.billing, type: 'object' } }, 'billing');
        }
        if (typeof parsed.billingSameAsShipping === 'boolean') {
          onChange(
            {
              target: {
                name: 'billingSameAsShipping',
                value: parsed.billingSameAsShipping,
                type: 'checkbox',
                checked: parsed.billingSameAsShipping,
              },
            },
            'checkbox'
          );
        }
        if (parsed.shippingMethodId) {
          onChange({ target: { name: 'shippingMethodId', value: parsed.shippingMethodId, type: 'radio' } }, 'shipping');
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, [user]);

  // Save formData to localStorage per user whenever it changes
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(getLocalStorageKey(user.uid), JSON.stringify(formData));
    } catch {
      // Ignore localStorage errors
    }
  }, [formData, user]);

  // Filter cart items to only those valid & in stock (your logic unchanged)
  const filteredCartItems = cartItems.filter((item) => {
    const rawPrice = item.prices?.price ?? item.price ?? '';
    const priceFloat = parseFloat(rawPrice);
    const priceValid = !isNaN(priceFloat) && priceFloat > 0;

    const hasStockInfo =
      item.hasOwnProperty('stock_quantity') ||
      item.hasOwnProperty('in_stock') ||
      item.hasOwnProperty('is_in_stock') ||
      item.hasOwnProperty('stock_status');

    const stockInQuantity = typeof item.stock_quantity === 'number' ? item.stock_quantity > 0 : true;

    const stockInFlag =
      (typeof item.in_stock === 'boolean' ? item.in_stock : true) &&
      (typeof item.is_in_stock === 'boolean' ? item.is_in_stock : true) &&
      (typeof item.stock_status === 'string' ? item.stock_status.toLowerCase() === 'instock' : true);

    return priceValid && (!hasStockInfo || (stockInQuantity && stockInFlag));
  });

  const handleDeleteAddress = () => {
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

    setSelectedShippingMethodId(null);

    if (user) {
      localStorage.removeItem(getLocalStorageKey(user.uid));
    }

    onChange({ target: { name: 'shipping', value: emptyAddress, type: 'object' } }, 'shipping');

    if (!formData.billingSameAsShipping) {
      onChange({ target: { name: 'billing', value: emptyAddress, type: 'object' } }, 'billing');
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

  // Fetch states for shipping country
  useEffect(() => {
    const country = formData.shipping.country;
    if (!country) return setShippingStates([]);

    fetch(`${API_BASE}/data/states/${country}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setShippingStates)
      .catch(() => setShippingStates([]));
  }, [formData.shipping.country]);

  // Fetch states for billing country (if different)
  useEffect(() => {
    if (formData.billingSameAsShipping) return setBillingStates([]);
    const country = formData.billing.country;
    if (!country) return setBillingStates([]);

    fetch(`${API_BASE}/data/states/${country}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setBillingStates)
      .catch(() => setBillingStates([]));
  }, [formData.billing.country, formData.billingSameAsShipping]);

  // Set selected shipping method when formData changes
  useEffect(() => {
    setSelectedShippingMethodId(formData.shippingMethodId || null);
  }, [formData.shippingMethodId]);

  // Fetch shipping methods grouped by zone when shipping country changes
  useEffect(() => {
    const fetchShippingMethodsByCountry = async () => {
      if (!formData.shipping.country) {
        setMethodsByZone({});
        return;
      }

      try {
        const zonesRes = await fetch(
          `${API_BASE}/shipping/zones?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
        );
        const zones = await zonesRes.json();

        const countryCode = formData.shipping.country.toUpperCase();

        const matchedZones = [];

        for (const zone of zones) {
          const locationsRes = await fetch(
            `${API_BASE}/shipping/zones/${zone.id}/locations?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
          );
          const locations = await locationsRes.json();

          const matchesCountry = locations.some((loc) => loc.code.toUpperCase() === countryCode);

          if (matchesCountry) {
            matchedZones.push(zone);
          }
        }

        if (matchedZones.length === 0) {
          const defaultZoneRes = await fetch(
            `${API_BASE}/shipping/zones/0/methods?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
          );
          const defaultMethods = await defaultZoneRes.json();
          setMethodsByZone({ Default: defaultMethods || [] });
          return;
        }

        const groupedMethods = {};
        for (const zone of matchedZones) {
          const methodsRes = await fetch(
            `${API_BASE}/shipping/zones/${zone.id}/methods?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
          );
          const methods = await methodsRes.json();
          groupedMethods[zone.name] = methods;
        }

        setMethodsByZone(groupedMethods);
      } catch (error) {
        console.error('Error fetching shipping methods by country:', error);
        setMethodsByZone({});
      }
    };

    fetchShippingMethodsByCountry();
  }, [formData.shipping.country]);

  const handleShippingMethodChange = (id) => {
    onChange({ target: { name: 'shippingMethodId', value: id, type: 'radio' } }, 'shipping');
  };

  const handleAddAddressClick = () => {
    if (!user) {
      setShowSignInModal(true);
      return;
    }
    setShowForm((prev) => !prev);
    setSaveSuccess(false);
    setError(null);
  };
// Add this near the top, with other handlers
// Add this near the top of CheckoutLeft component
const handlePaymentSelect = (id, title) => {
  onChange({ target: { name: 'paymentMethod', value: id, type: 'radio' } }, 'payment');
  onChange({ target: { name: 'paymentMethodTitle', value: title, type: 'text' } }, 'payment');
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);




    const payload = {
      shipping: formData.shipping,
      billing: formData.billingSameAsShipping ? formData.shipping : formData.billing,
      billingSameAsShipping: formData.billingSameAsShipping,
      shippingMethodId: formData.shippingMethodId || null,
    };

    if (user) payload.userId = user.uid;

    try {
      const res = await fetch('https://db.store1920.com/wp-json/custom/v1/save-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');
      await res.json();
      setSaveSuccess(true);
      setShowForm(false);
      if (user) localStorage.removeItem(getLocalStorageKey(user.uid)); // Clear user localStorage on successful save
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
            <h2
              className="shippingadress"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
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
                    <img src={DeleteIcon} style={{ width: '20px', height: '20px' }} />
                  </button>
                )}
              </div>
            </h2>

            {formData?.shipping?.address1 ? (
              <div className="saved-address-box">
                <div className="saved-address-grid">
                  <div className="saved-address-label">Name</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.fullName}</div>

                  <div className="saved-address-label">Address</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.address1}</div>

                  <div className="saved-address-label">City</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.city}</div>

                  <div className="saved-address-label">State</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.state}</div>

                  <div className="saved-address-label">Phone</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">+{formData.shipping.phone}</div>

                  <div className="saved-address-label">Postal Code</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.postalCode}</div>

                  <div className="saved-address-label">Country</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {countries[formData.shipping.country]?.name || formData.shipping.country}
                  </div>
                </div>
              </div>
            ) : (
              !showForm && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <img
                    src={emptyAddressImg}
                    alt="No address found"
                    style={{ maxWidth: '50px', opacity: 0.6 }}
                  />
                  <p style={{ color: '#777', marginTop: '10px' }}>No address added yet.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <ShippingMethods
        selectedMethodId={selectedShippingMethodId}
        onSelect={(id) => {
          setSelectedShippingMethodId(id);
          handleShippingMethodChange(id);
        }}
        methodsByZone={methodsByZone}
      />

      <div className="section-block">
        <ItemList items={filteredCartItems} onRemove={handleRemoveItem} />
      </div>

      <div className="section-block">
<PaymentMethods
  selectedMethod={formData.paymentMethod || 'cod'}
  onMethodSelect={handlePaymentSelect}
/>

      </div>
<div className='desktop-only'>
      <HelpText />
  {/* <ProductsUnder20AED/> */}
</div>


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

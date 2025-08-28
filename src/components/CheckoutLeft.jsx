import React, { useState, useEffect } from 'react';
import '../assets/styles/checkoutleft.css';
import SignInModal from './sub/SignInModal';
import HelpText from './HelpText';
import PaymentMethods from '../components/checkoutleft/PaymentMethods';
import AddressForm from '../components/checkoutleft/AddressForm';
import ItemList from './checkoutleft/ItemList';
import ShippingMethods from '../components/checkout/ShippingMethods';
import emptyAddressImg from '../assets/images/adress-not-found.png';
import ProductsUnder20AED from './ProductsUnder20AED';

const API_BASE = 'https://db.store1920.com/wp-json';
const WC_CONSUMER_KEY = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const WC_CONSUMER_SECRET = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const getLocalStorageKey = (userId) => `checkoutAddressData_${userId || 'guest'}`;

const CheckoutLeft = ({
  formData,
  onChange,
  countries,
  cartItems,
  onRemoveItem,
  onPaymentMethodSelect,
  subtotal,
  orderId
}) => {
  const [user, setUser] = useState(null); // WordPress auth handled via cookies
  const [showForm, setShowForm] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [shippingStates, setShippingStates] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [methodsByZone, setMethodsByZone] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(null);

  // Load saved address from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getLocalStorageKey('wp_user'));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.shipping) onChange({ target: { name: 'shipping', value: parsed.shipping, type: 'object' } }, 'shipping');
        if (parsed.billing) onChange({ target: { name: 'billing', value: parsed.billing, type: 'object' } }, 'billing');
        if (typeof parsed.billingSameAsShipping === 'boolean') onChange({ target: { name: 'billingSameAsShipping', value: parsed.billingSameAsShipping, type: 'checkbox', checked: parsed.billingSameAsShipping } }, 'checkbox');
        if (parsed.shippingMethodId) onChange({ target: { name: 'shippingMethodId', value: parsed.shippingMethodId, type: 'radio' } }, 'shipping');
      }
    } catch {}
  }, [onChange]);

  // Save formData to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(getLocalStorageKey('wp_user'), JSON.stringify(formData));
    } catch {}
  }, [formData]);

  // Auto-open AddressForm if shipping address is empty
  useEffect(() => {
    const isShippingEmpty = !formData?.shipping?.address1?.trim();
    if (isShippingEmpty) setShowForm(true);
  }, [formData?.shipping]);

  const filteredCartItems = cartItems.filter((item) => {
    const price = parseFloat(item.prices?.price ?? item.price ?? 0);
    const inStockQuantity = typeof item.stock_quantity === 'number' ? item.stock_quantity > 0 : true;
    const inStockFlag = (typeof item.in_stock !== 'boolean' || item.in_stock) &&
                        (typeof item.is_in_stock !== 'boolean' || item.is_in_stock) &&
                        (typeof item.stock_status !== 'string' || item.stock_status.toLowerCase() === 'instock');
    return price > 0 && inStockQuantity && inStockFlag;
  });

  const handleDeleteAddress = () => {
    const emptyAddress = { fullName: '', address1: '', address2: '', city: '', state: '', postalCode: '', country: '', phone: '' };
    setSelectedShippingMethodId(null);
    localStorage.removeItem(getLocalStorageKey('wp_user'));
    onChange({ target: { name: 'shipping', value: emptyAddress, type: 'object' } }, 'shipping');
    if (!formData.billingSameAsShipping) onChange({ target: { name: 'billing', value: emptyAddress, type: 'object' } }, 'billing');
  };

  const handleRemoveItem = (itemId) => onRemoveItem?.(itemId);

  // Fetch shipping states
  useEffect(() => {
    const country = formData.shipping.country;
    if (!country) return setShippingStates([]);
    fetch(`${API_BASE}/wc/v3/data/states/${country}?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setShippingStates)
      .catch(() => setShippingStates([]));
  }, [formData.shipping.country]);

  // Fetch billing states if billing differs
  useEffect(() => {
    if (formData.billingSameAsShipping) return setBillingStates([]);
    const country = formData.billing.country;
    if (!country) return setBillingStates([]);
    fetch(`${API_BASE}/wc/v3/data/states/${country}?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setBillingStates)
      .catch(() => setBillingStates([]));
  }, [formData.billing.country, formData.billingSameAsShipping]);

  useEffect(() => {
    setSelectedShippingMethodId(formData.shippingMethodId || null);
  }, [formData.shippingMethodId]);

  // Fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      if (!formData.shipping.country) return setMethodsByZone({});
      try {
        const zonesRes = await fetch(`${API_BASE}/wc/v3/shipping/zones?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`);
        const zones = await zonesRes.json();
        const countryCode = formData.shipping.country.toUpperCase();
        const matchedZones = [];

        for (const zone of zones) {
          const locationsRes = await fetch(`${API_BASE}/wc/v3/shipping/zones/${zone.id}/locations?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`);
          const locations = await locationsRes.json();
          if (locations.some((loc) => loc.code.toUpperCase() === countryCode)) matchedZones.push(zone);
        }

        if (!matchedZones.length) {
          const defaultZoneRes = await fetch(`${API_BASE}/wc/v3/shipping/zones/0/methods?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`);
          const defaultMethods = await defaultZoneRes.json();
          setMethodsByZone({ Default: defaultMethods || [] });
          return;
        }

        const groupedMethods = {};
        for (const zone of matchedZones) {
          const methodsRes = await fetch(`${API_BASE}/wc/v3/shipping/zones/${zone.id}/methods?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`);
          groupedMethods[zone.name] = await methodsRes.json();
        }
        setMethodsByZone(groupedMethods);
      } catch {
        setMethodsByZone({});
      }
    };
    fetchShippingMethods();
  }, [formData.shipping.country]);

  const handleShippingMethodChange = (id) => {
    onChange({ target: { name: 'shippingMethodId', value: id, type: 'radio' } }, 'shipping');
  };

  const handleAddAddressClick = () => {
    setShowForm((prev) => !prev);
    setSaveSuccess(false);
    setError(null);
  };

  const handlePaymentSelect = (id, title) => {
    onChange({ target: { name: 'paymentMethod', value: id, type: 'radio' } }, 'payment');
    onChange({ target: { name: 'paymentMethodTitle', value: title, type: 'text' } }, 'payment');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    // Transform addresses to WooCommerce expected fields
    const formatAddress = (addr) => ({
      first_name: addr.fullName.split(' ')[0] || '',
      last_name: addr.fullName.split(' ')[1] || '',
      address_1: addr.address1,
      address_2: addr.address2,
      city: addr.city,
      state: addr.state,
      postcode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
    });

    const payload = {
      shipping: formatAddress(formData.shipping),
      billing: formData.billingSameAsShipping ? formatAddress(formData.shipping) : formatAddress(formData.billing),
      billingSameAsShipping: formData.billingSameAsShipping,
      shippingMethodId: formData.shippingMethodId || null,
    };

    try {
      const res = await fetch(`${API_BASE}/custom/v1/save-address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save address');
      await res.json();
      setSaveSuccess(true);
      setShowForm(false);
      localStorage.removeItem(getLocalStorageKey('wp_user'));
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="checkout-left">
      {/* Shipping Address Section */}
      <div className="shipping-container">
        <div className="section-block">
          <div className="section-header">
            <h2 className="shippingadress" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Shipping Address</span>
              <button
                onClick={handleAddAddressClick}
                className={`btn-add-address1 ${showForm ? 'cancel-btn1' : ''}`}
              >
                {showForm ? 'Cancel' : formData?.shipping?.address1 ? 'Change Address' : 'Add New Address'}
              </button>
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
                  <div className="saved-address-label">Phone</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">+{formData.shipping.phone}</div>
                  <div className="saved-address-label">State</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.state}</div>
                  <div className="saved-address-label">Country</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">United Arab Emirates</div>
                </div>
              </div>
            ) : !showForm && (
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <img src={emptyAddressImg} alt="No address found" style={{ maxWidth: '50px', opacity: 0.6 }} />
                <p style={{ color: '#777', marginTop: '10px' }}>No address added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Methods */}
      <ShippingMethods
        selectedMethodId={selectedShippingMethodId}
        onSelect={(id) => {
          setSelectedShippingMethodId(id);
          handleShippingMethodChange(id);
        }}
        methodsByZone={methodsByZone}
      />

      {/* Cart Items */}
      <div className="section-block">
        <ItemList items={filteredCartItems} onRemove={handleRemoveItem} />
      </div>

      {/* Payment Methods */}
      {formData.paymentMethod === 'paymob' && orderId && (
        <PaymentMethods
          selectedMethod={formData.paymentMethod || 'cod'}
          onMethodSelect={handlePaymentSelect}
          subtotal={subtotal}
          orderId={orderId}
        />
      )}

      {/* Sidebar Help */}
      <div className="desktop-only">
        <HelpText />
        <ProductsUnder20AED />
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onLogin={() => {
          setShowSignInModal(false);
          setShowForm(true);
          setSaveSuccess(false);
          setError(null);
        }}
      />

      {/* Address Form Modal */}
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

      {/* Success Toast */}
      {saveSuccess && <div className="addrf-toast">✅ Address saved successfully!</div>}
    </div>
  );
};

export default CheckoutLeft;
 
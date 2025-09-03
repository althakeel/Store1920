// src/components/checkout/CheckoutLeft.jsx
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
import { useCart } from '../contexts/CartContext';


const API_BASE = 'https://db.store1920.com/wp-json';
const WC_CONSUMER_KEY = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const WC_CONSUMER_SECRET = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const getLocalStorageKey = (userId) => `checkoutAddressData_${userId || 'guest'}`;

export default function CheckoutLeft({
  countries,
  cartItems,
  subtotal,
  orderId,
  formData,
  setFormData,
  handlePlaceOrder,
  createOrder
}) {
  const [showForm, setShowForm] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [shippingStates, setShippingStates] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [methodsByZone, setMethodsByZone] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(null);
  const { removeFromCart } = useCart();

  // -------------------------------
  // Initialize cart items once on mount
  // -------------------------------
  useEffect(() => {
    if (!formData.cartItems || formData.cartItems.length === 0) {
      setFormData(prev => ({ ...prev, cartItems: cartItems || [] }));
    }
    // run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------
  // Handle form field changes
  // -------------------------------
  const handleFieldChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      if (section === 'shipping' || section === 'billing') {
        return { ...prev, [section]: { ...prev[section], [name]: value } };
      } else if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      }
      return { ...prev, [name]: value };
    });
  };

  // -------------------------------
  // Remove cart item (works now)
  // -------------------------------
const handleRemoveItem = (itemId) => {
  // Remove from local formData
  setFormData(prev => {
    const newCartItems = (prev.cartItems || []).filter(i => {
      const id = i.id ?? i.product_id ?? i.sku ?? i.slug ?? null;
      return id !== itemId;
    });
    console.log('Removed itemId:', itemId, 'New cart items:', newCartItems);
    return { ...prev, cartItems: newCartItems };
  });

  // Also remove from CartContext
  removeFromCart(itemId);
};

  // -------------------------------
  // Delete address
  // -------------------------------
  const handleDeleteAddress = () => {
    const emptyAddress = {
      first_name: '', last_name: '', email: '', street: '', apartment: '',
      city: '', state: '', postal_code: '', country: '', phone_number: ''
    };
    setSelectedShippingMethodId(null);
    localStorage.removeItem(getLocalStorageKey('wp_user'));
    setFormData(prev => ({
      ...prev,
      shipping: emptyAddress,
      billing: prev.billingSameAsShipping ? emptyAddress : prev.billing
    }));
  };

  // -------------------------------
  // Save formData to localStorage
  // -------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(getLocalStorageKey('wp_user'), JSON.stringify(formData));
    } catch {}
  }, [formData]);

  // -------------------------------
  // Auto-open address form if empty
  // -------------------------------
  useEffect(() => {
    if (!formData?.shipping?.street?.trim()) setShowForm(true);
  }, [formData?.shipping]);

  // -------------------------------
  // Shipping method
  // -------------------------------
  useEffect(() => {
    setSelectedShippingMethodId(formData.shippingMethodId || null);
  }, [formData.shippingMethodId]);

  const handleShippingMethodChange = (id) => {
    setFormData(prev => ({ ...prev, shippingMethodId: id }));
  };

  // -------------------------------
  // UI handlers
  // -------------------------------
  const handleAddAddressClick = () => {
    setShowForm(prev => !prev);
    setSaveSuccess(false);
    setError(null);
  };

  const handlePaymentSelect = (id, title) => {
    setFormData(prev => ({ ...prev, paymentMethod: id, paymentMethodTitle: title }));
  };

  // -------------------------------
  // Submit address
  // -------------------------------
const handleSubmit = async (e) => {
  if (e && e.preventDefault) e.preventDefault(); // safe check
  setSaving(true);
  setError(null);
  setSaveSuccess(false);

  const formatAddress = (addr) => ({
    first_name: addr.first_name || '',
    last_name: addr.last_name || '',
    email: addr.email || '',
    address_1: addr.street || '',
    address_2: addr.apartment || '',
    city: addr.city || '',
    state: addr.state || '',
    postcode: addr.postal_code || '',
    country: addr.country || '',
    phone: addr.phone_number || ''
  });

  const payload = {
    shipping: formatAddress(formData.shipping),
    billing: formData.billingSameAsShipping ? formatAddress(formData.shipping) : formatAddress(formData.billing),
    billingSameAsShipping: formData.billingSameAsShipping,
    shippingMethodId: formData.shippingMethodId || null
  };

  try {
    const res = await fetch(`${API_BASE}/custom/v1/save-address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
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
              <button onClick={handleAddAddressClick} className={`btn-add-address1 ${showForm ? 'cancel-btn1' : ''}`}>
                {showForm ? 'Cancel' : formData?.shipping?.street ? 'Change Address' : 'Add New Address'}
              </button>
            </h2>

            {formData?.shipping?.street ? (
              <div className="saved-address-box">
                <div className="saved-address-grid">
                  <div className="saved-address-label">Name</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.first_name} {formData.shipping.last_name}</div>

                  <div className="saved-address-label">Address</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">
                    {formData.shipping.street}{formData.shipping.apartment ? `, ${formData.shipping.apartment}` : ''}
                  </div>

                  <div className="saved-address-label">City</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">{formData.shipping.city}</div>

                  <div className="saved-address-label">Phone</div>
                  <div className="saved-address-colon">:</div>
                  <div className="saved-address-value">+{formData.shipping.phone_number}</div>

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
        onSelect={(id) => { setSelectedShippingMethodId(id); handleShippingMethodChange(id); }}
        subtotal={subtotal}
      />

      {/* Cart Items */}
      <div className="section-block">
        <ItemList items={formData.cartItems || []} onRemove={handleRemoveItem} />
      </div>

      {/* Payment Methods */}
      <PaymentMethods
        selectedMethod={formData.paymentMethod || 'cod'}
        onMethodSelect={handlePaymentSelect}
        subtotal={subtotal}
        orderId={orderId}
      />

      {/* Sidebar Help */}
      <div className="desktop-only">
        <HelpText />
        <ProductsUnder20AED />
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onLogin={() => { setShowSignInModal(false); setShowForm(true); setSaveSuccess(false); setError(null); }}
      />

      {/* Address Form */}
      {showForm && (
        <AddressForm
          formData={formData}
          shippingStates={shippingStates}
          billingStates={billingStates}
          countries={countries}
          onChange={handleFieldChange}
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
}

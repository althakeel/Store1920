import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CheckoutLeft from '../components/CheckoutLeft';
import CheckoutRight from '../components/CheckoutRight';
import SignInModal from '../components/sub/SignInModal';
import '../assets/styles/checkout.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const buildUrl = (endpoint) =>
  `${API_BASE}/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems: contextCartItems, clearCart } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    shipping: {
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    billing: {
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      email: '',
    },
    billingSameAsShipping: true,
    paymentMethod: '',
    paymentMethodTitle: '',
  });

  // Sync context cart with local cart
  useEffect(() => {
    setCartItems(contextCartItems);
  }, [contextCartItems]);

  // Fetch countries and payment methods
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        const [countriesRes, paymentRes] = await Promise.all([
          fetch(buildUrl('data/countries')),
          fetch(buildUrl('payment_gateways')),
        ]);

        const countriesData = await countriesRes.json();
        const paymentData = await paymentRes.json();

        setCountries(countriesData);
        setPaymentMethods(paymentData);
      } catch (err) {
        setError(err.message || 'Failed to load checkout data.');
      } finally {
        setLoading(false);
      }

      const token = localStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };

    fetchCheckoutData();
  }, []);

  // Update formData when selected payment method changes
  useEffect(() => {
    if (!selectedPaymentMethod) return;
    const method = paymentMethods.find((m) => m.id === selectedPaymentMethod);
    if (method) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: method.id,
        paymentMethodTitle: method.title,
      }));
    }
  }, [selectedPaymentMethod, paymentMethods]);

  const handleChange = (e, section) => {
    const { name, value, checked, type } = e.target;
    if (section === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        billingSameAsShipping: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: value },
      }));
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) =>
      prev.filter((item) => (item.id || item.product_id) !== itemId)
    );
  };

  const handleShippingMethodSelect = (id) => {
    setFormData((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, shippingMethodId: id },
    }));
  };

  const handleRequireLogin = () => {
    setShowSignInModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowSignInModal(false);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0) * item.quantity,
    0
  );

  // Submit order
  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);

      const lineItems = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const shipping = formData.shipping;
      const billing = formData.billingSameAsShipping ? shipping : formData.billing;

      const orderPayload = {
        payment_method: formData.paymentMethod,
        payment_method_title: formData.paymentMethodTitle,
        set_paid: false,
        billing: {
          first_name: billing.fullName,
          address_1: billing.address1,
          address_2: billing.address2,
          city: billing.city,
          state: billing.state,
          postcode: billing.postalCode,
          country: billing.country,
          phone: billing.phone,
          email: billing.email,
        },
        shipping: {
          first_name: shipping.fullName,
          address_1: shipping.address1,
          address_2: shipping.address2,
          city: shipping.city,
          state: shipping.state,
          postcode: shipping.postalCode,
          country: shipping.country,
          phone: shipping.phone,
        },
        line_items: lineItems,
      };

      const res = await fetch(buildUrl('orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await res.json();

      if (res.ok && orderData.id) {
        clearCart();
        navigate(`/order-success?order_id=${orderData.id}`);
      } else {
        throw new Error(orderData.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'Error placing order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading checkout...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="checkoutGrid">
      <CheckoutLeft
        formData={formData}
        onChange={handleChange}
        countries={countries}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onPaymentMethodSelect={setSelectedPaymentMethod}
      />

      <CheckoutRight
        cartItems={cartItems}
        subtotal={subtotal}
        formData={formData}
        onShippingMethodSelect={handleShippingMethodSelect}
        onFormChange={handleChange}
        paymentMethods={paymentMethods}
        selectedPaymentMethod={selectedPaymentMethod}
        isLoggedIn={isLoggedIn}
        onRequireLogin={handleRequireLogin}
        onPlaceOrder={handlePlaceOrder}
        submitting={submitting}
      />

      {showSignInModal && (
        <SignInModal
          onClose={() => setShowSignInModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

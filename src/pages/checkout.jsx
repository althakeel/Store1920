import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import CheckoutLeft from '../components/CheckoutLeft';
import CheckoutRight from '../components/CheckoutRight';
import '../assets/styles/checkout.css';

const API_BASE = 'https://store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const buildUrl = (endpoint) =>
  `${API_BASE}/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}`;

export default function CheckoutPage() {
  const { cartItems: contextCartItems } = useCart();

  // State declarations: always define state BEFORE useEffect hooks that use them
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
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
    },
    billingSameAsShipping: true,
    paymentMethod: '',
    paymentMethodTitle: '',
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync local cart items with context cart items
  useEffect(() => {
    setCartItems(contextCartItems);
  }, [contextCartItems]);

  // Fetch countries and payment methods on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const countriesRes = await fetch(buildUrl('data/countries'));
        const countriesData = await countriesRes.json();
        setCountries(countriesData);

        const paymentRes = await fetch(buildUrl('payment_gateways'));
        const paymentData = await paymentRes.json();
        setPaymentMethods(paymentData);
      } catch (err) {
        setError(err.message || 'Failed to load checkout data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update formData payment method fields when selectedPaymentMethod or paymentMethods change
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

  // Handler to remove an item by id/product_id
  const handleRemoveItem = (itemId) => {
    setCartItems((prev) =>
      prev.filter((item) => (item.id || item.product_id) !== itemId)
    );
  };

  // Calculate subtotal based on local cartItems state
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0) * item.quantity,
    0
  );

  // Unified form change handler for shipping/billing inputs and checkbox
  const handleChange = (e, section) => {
    const { name, value, checked, type } = e.target;
    if (section === 'checkbox') {
      setFormData((prev) => ({ ...prev, billingSameAsShipping: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: value },
      }));
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
        onPaymentMethodSelect={setSelectedPaymentMethod} // Pass selected payment method setter
      />

      <CheckoutRight
        cartItems={cartItems}
        subtotal={subtotal}
        formData={formData}
        onFormChange={handleChange}
        paymentMethods={paymentMethods}
        selectedPaymentMethod={selectedPaymentMethod}
      />
    </div>
  );
}

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
  const { cartItems } = useCart();

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
    // You can add other checkout fields here like paymentMethod, couponCode, etc.
  });

  const [countries, setCountries] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch WooCommerce data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch countries - keep as object for easy use in AddressForm
        const countriesRes = await fetch(buildUrl('data/countries'));
        const countriesData = await countriesRes.json();
        setCountries(countriesData);

        // Fetch payment methods
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

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0) * item.quantity,
    0
  );

  // Unified form change handler
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
      />

      <CheckoutRight
        cartItems={cartItems}
        subtotal={subtotal}
        formData={formData}
        onFormChange={handleChange}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}

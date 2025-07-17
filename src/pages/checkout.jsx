import React, { useState, useEffect } from 'react';
import CheckoutLeft from '../components/CheckoutLeft';
import CheckoutRight from '../components/CheckoutRight';
import '../assets/styles/checkout.css';

const API_BASE = 'https://store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

// Static fallback countries data
const staticCountries = [
  { code: 'US', name: 'United States' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  // Add more as needed
];

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
    shipToDifferentAddress: false,
    shippingAddress: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      state: '',
    },
    paymentMethod: '',
    couponCode: '',
  });

  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [subtotal] = useState(250);
  const [countries, setCountries] = useState(staticCountries);
  const [shippingCountries, setShippingCountries] = useState(staticCountries);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  const total = Math.max(subtotal - discount, 0);

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        setLoading(true);

        // We skip fetching countries since we have static fallback
        const paymentRes = await fetch(
          `${API_BASE}/payment_gateways?consumer_key=${CK}&consumer_secret=${CS}`
        );

        if (!paymentRes.ok) throw new Error('Failed to fetch payment methods');

        const paymentData = await paymentRes.json();
        setPaymentMethods(paymentData);
      } catch (err) {
        console.error('Payment methods fetch error:', err);
        setPaymentMethods([]); // fallback empty array
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentMethods();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'shipToDifferentAddress') {
      setFormData((prev) => ({
        ...prev,
        shipToDifferentAddress: checked,
      }));
      return;
    }

    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const applyCoupon = () => {
    if (formData.couponCode.toLowerCase() === 'save10') {
      setDiscount(10);
      setCouponError('');
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };

  const placeOrder = () => {
    alert(`Order placed! Total: $${total.toFixed(2)}\nPayment: ${formData.paymentMethod}`);
  };

  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }

  return (
    <div className="checkoutGrid">
      <CheckoutLeft
        formData={formData}
        onChange={handleChange}
        countries={countries}
        shippingCountries={shippingCountries}
      />
      <CheckoutRight
        subtotal={subtotal}
        discount={discount}
        total={total}
        couponCode={formData.couponCode}
        onCouponChange={handleChange}
        onApplyCoupon={applyCoupon}
        couponError={couponError}
        onPlaceOrder={placeOrder}
        paymentMethods={paymentMethods}
        selectedPaymentMethod={formData.paymentMethod}
        onPaymentMethodChange={handleChange}
      />
    </div>
  );
}

import React, { useState } from 'react';
import CheckoutLeft from '../components/CheckoutLeft';
import CheckoutRight from '../components/CheckoutRight';
import { useCart } from '../contexts/CartContext';
import '../assets/styles/checkout.css';

const API_BASE = 'https://store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_8adb881aaff96e651cf69b9a8128aa5d9c80eb46';
const CONSUMER_SECRET = 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
    shippingAddress: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    shipToDifferentAddress: false,
    paymentMethod: 'cod',
    cardNumber: '',
    expiry: '',
    cvv: '',
    couponCode: ''
  });

  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(subtotal - discount, 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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

  const placeOrder = async () => {
    const [firstName, ...lastParts] = formData.fullName.split(' ');
    const billing = {
      first_name: firstName,
      last_name: lastParts.join(' '),
      address_1: formData.address,
      city: formData.city,
      state: formData.state,
      postcode: formData.postalCode,
      country: formData.country,
      email: formData.email,
      phone: formData.phone
    };

    const shipping = formData.shipToDifferentAddress
      ? {
          first_name: formData.shippingAddress.fullName.split(' ')[0],
          last_name: formData.shippingAddress.fullName.split(' ').slice(1).join(' '),
          address_1: formData.shippingAddress.address,
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          postcode: formData.shippingAddress.postalCode,
          country: formData.shippingAddress.country
        }
      : billing;

    const orderPayload = {
      payment_method: formData.paymentMethod,
      payment_method_title: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
      set_paid: formData.paymentMethod === 'cod',
      billing,
      shipping,
      line_items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const res = await fetch(
        `${API_BASE}/orders?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderPayload)
        }
      );

      if (!res.ok) throw new Error('Failed to place order');

      const order = await res.json();
      alert(`Order #${order.id} placed successfully!`);
      clearCart();
      window.location.href = '/';
    } catch (err) {
      console.error('Order Error:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="checkoutGrid">
      <CheckoutLeft formData={formData} onChange={handleChange} />
      <CheckoutRight
        subtotal={subtotal}
        discount={discount}
        total={total}
        couponCode={formData.couponCode}
        onCouponChange={handleChange}
        onApplyCoupon={applyCoupon}
        couponError={couponError}
        onPlaceOrder={placeOrder}
      />
    </div>
  );
}

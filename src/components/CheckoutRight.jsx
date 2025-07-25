// src/components/checkout/CheckoutRight.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/checkout/CheckoutRight.css';
import TrustSection from './checkout/TrustSection';
import CouponDiscount from './sub/account/CouponDiscount';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const buildUrl = (endpoint) =>
  `${API_BASE}/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}`;

function Alert({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const colors = {
    info: '#2f86eb',
    success: '#28a745',
    error: '#dc3545',
  };

  return (
    <div
      style={{
        padding: '12px 20px',
        marginBottom: '20px',
        backgroundColor: colors[type] || colors.info,
        color: 'white',
        borderRadius: '4px',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
      role="alert"
      aria-live="assertive"
    >
      {message}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          right: '12px',
          top: '12px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          lineHeight: 1,
        }}
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
}

export default function CheckoutRight({ cartItems, formData }) {
  const [alert, setAlert] = useState({ message: '', type: 'info' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Calculate totals
  const itemsTotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const subtotal = Math.max(0, itemsTotal - discount);
  const orderTotal = subtotal; // Add tax/fees if needed

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (
      !formData.billing.fullName ||
      !formData.billing.address1 ||
      !formData.billing.email ||
      !formData.paymentMethod ||
      !formData.paymentMethodTitle
    ) {
      showAlert('Please fill in all billing details and select a payment method.', 'error');
      return;
    }

    setIsPlacingOrder(true);

    // Split fullName into first and last names
    const [first_name, ...lastNameParts] = formData.billing.fullName.trim().split(' ');
    const last_name = lastNameParts.join(' ') || '';

    const billing = {
      first_name,
      last_name,
      address_1: formData.billing.address1,
      city: formData.billing.city || '',
      state: formData.billing.state || '',
      postcode: formData.billing.postalCode || '',
      country: formData.billing.country || '',
      email: formData.billing.email,
      phone: formData.billing.phone || '',
    };

    const shipping = formData.billingSameAsShipping
      ? { ...billing }
      : {
          first_name: (formData.shipping.fullName || '').split(' ')[0] || '',
          last_name: (formData.shipping.fullName || '').split(' ').slice(1).join(' ') || '',
          address_1: formData.shipping.address1,
          city: formData.shipping.city || '',
          state: formData.shipping.state || '',
          postcode: formData.shipping.postalCode || '',
          country: formData.shipping.country || '',
        };

    const line_items = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const res = await axios.post(buildUrl('orders'), {
        billing,
        shipping,
        line_items,
        payment_method: formData.paymentMethod,
        payment_method_title: formData.paymentMethodTitle,
        set_paid: formData.paymentMethod !== 'cod',
      });

      showAlert(`Order placed successfully! Order ID: ${res.data.id}`, 'success');

      setTimeout(() => {
        window.location.href = `/order-confirmation/${res.data.id}`;
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert('Failed to place order: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Handle coupon from child component
  const handleCoupon = (couponData) => {
    if (couponData) {
      let discountAmount = 0;
      if (couponData.discount_type === 'percent') {
        discountAmount = (itemsTotal * parseFloat(couponData.amount)) / 100;
      } else {
        discountAmount = parseFloat(couponData.amount);
      }
      discountAmount = Math.min(discountAmount, itemsTotal);

      setDiscount(discountAmount);
      showAlert(`Coupon applied! You saved AED ${discountAmount.toFixed(2)}`, 'success');
      console.log('Coupon applied:', couponData);
    } else {
      setDiscount(0);
      showAlert('Coupon removed or invalid.', 'error');
      console.log('Coupon invalid or removed');
    }
  };

  const getButtonStyle = () => {
    switch (formData.paymentMethod) {
      case 'apple_pay':
        return {
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          fontWeight: '600',
          padding: '14px 36px',
          cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
        };
      case 'cod':
        return {
          backgroundColor: '#f97316',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          fontWeight: '600',
          padding: '14px 36px',
          cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
        };
      case 'card':
        return {
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          fontWeight: '600',
          padding: '14px 36px',
          cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
        };
      default:
        return {
          backgroundColor: '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          fontWeight: '600',
          padding: '14px 36px',
          cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
        };
    }
  };

  return (
    <aside className="checkoutRightContainer">
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: 'info' })}
      />

      <h2>Order Summary</h2>
      <CouponDiscount onApplyCoupon={handleCoupon} />

      <div className="summaryRowCR discountCR">
        <span>Item(s) total:</span>
        <span>AED {itemsTotal.toFixed(2)}</span>
      </div>

      <div
        className="summaryRow discount"
        style={{ color: 'red', fontWeight: '600' }}
        aria-label={`Discount AED ${discount.toFixed(2)}`}
      >
        <span>Item(s) discount:</span>
        <span>-AED {discount.toFixed(2)}</span>
      </div>

      <div className="summaryRowCR">
        <span>Subtotal:</span>
        <span>AED {subtotal.toFixed(2)}</span>
      </div>

      <div className="summaryRowCR totalCR" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
        <span>Order total:</span>
        <span>AED {orderTotal.toFixed(2)}</span>
      </div>

      <p
        style={{
          fontSize: '0.875rem',
          color: '#666',
          marginTop: '1rem',
          lineHeight: '1.4',
        }}
      >
        All fees and applicable taxes are included, and no additional charges will apply.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
        By submitting your order, you agree to our{' '}
        <a href="/terms-0f-use" target="_blank" rel="noopener noreferrer">
          Terms of Use
        </a>{' '}
        and{' '}
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        .
      </p>

      <button
        className="placeOrderBtnCR"
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder}
        style={getButtonStyle()}
        aria-disabled={isPlacingOrder}
      >
        {isPlacingOrder
          ? `Placing Order${formData.paymentMethodTitle ? ` with ${formData.paymentMethodTitle}` : ''}...`
          : `Place Order${formData.paymentMethodTitle ? ` with ${formData.paymentMethodTitle}` : ''}`}
      </button>

      <TrustSection />
    </aside>
  );
}

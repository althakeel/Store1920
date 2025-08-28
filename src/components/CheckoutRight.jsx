// src/components/checkout/CheckoutRight.jsx
import React, { useState, useEffect } from 'react';
import '../assets/styles/checkout/CheckoutRight.css';
import TrustSection from './checkout/TrustSection';
import CouponDiscount from './sub/account/CouponDiscount';
import CoinBalance from './sub/account/CoinBalace';
import HelpText from './HelpText';

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

export default function CheckoutRight({ cartItems, formData, createOrder, clearCart }) {
  const [alert, setAlert] = useState({ message: '', type: 'info' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [coinDiscount, setCoinDiscount] = useState(0);

  const itemsTotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const subtotal = Math.max(0, itemsTotal - discount - coinDiscount);

  const showAlert = (message, type = 'info') => setAlert({ message, type });

  const handlePlaceOrder = async () => {
    const populatedBilling = formData.billingSameAsShipping
      ? { ...formData.shipping }
      : formData.billing;

    const [firstNameCheck] = (populatedBilling?.fullName || '').trim().split(' ');
    if (!firstNameCheck || !populatedBilling.address1 || !formData.paymentMethod) {
      showAlert('Please fill in all billing details and select a payment method.', 'error');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderId = await createOrder();

      if (formData.paymentMethod === 'cod' || formData.paymentMethod === 'card') {
        showAlert('Order placed successfully!', 'success');
        clearCart();
        window.location.href = `/order-success?order_id=${orderId}`;
      } else if (formData.paymentMethod === 'paymob') {
        window.location.href = `/paymob-checkout?order_id=${orderId}`;
      }
    } catch (err) {
      showAlert('Failed to place order: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCoupon = (couponData) => {
    if (!couponData) {
      setDiscount(0);
      showAlert('Coupon removed or invalid.', 'error');
      return;
    }

    let discountAmount = 0;
    if (couponData.discount_type === 'percent') {
      discountAmount = (itemsTotal * parseFloat(couponData.amount)) / 100;
    } else {
      discountAmount = parseFloat(couponData.amount);
    }

    discountAmount = Math.min(discountAmount, itemsTotal);

    setDiscount(discountAmount);
    showAlert(`Coupon applied! You saved AED ${discountAmount.toFixed(2)}`, 'success');
  };

  const handleCoinRedemption = ({ coinsUsed, discountAED }) => {
    setCoinDiscount(discountAED);
    showAlert(`You redeemed ${coinsUsed} coins for AED ${discountAED}`, 'success');
  };

  const handleRemoveCoinDiscount = () => {
    setCoinDiscount(0);
    showAlert('Coin discount removed.', 'info');
  };

  const getButtonStyle = () => {
    const base = {
      color: '#fff',
      border: 'none',
      borderRadius: '25px',
      fontWeight: 600,
      padding: '14px 36px',
      cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
    };

    switch (formData.paymentMethod) {
      case 'apple_pay':
        return { ...base, backgroundColor: '#000' };
      case 'cod':
        return { ...base, backgroundColor: '#f97316' };
      case 'card':
        return { ...base, backgroundColor: '#2563eb' };
      default:
        return { ...base, backgroundColor: '#10b981' };
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
        style={{ color: '#fe6c03', fontWeight: 600 }}
        aria-label={`Discount AED ${discount.toFixed(2)}`}
      >
        <span>Item(s) discount:</span>
        <span>-AED {discount.toFixed(2)}</span>
      </div>

      <CoinBalance onCoinRedeem={handleCoinRedemption} />

      {coinDiscount > 0 && (
        <div
          className="summaryRow"
          style={{
            color: 'green',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span>Coin discount:</span>
            <span style={{ marginLeft: 8 }}>-AED {coinDiscount.toFixed(2)}</span>
          </div>
          <button
            onClick={handleRemoveCoinDiscount}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#dc3545',
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            aria-label="Remove coin discount"
          >
            ×
          </button>
        </div>
      )}

      <div className="summaryRowCR">
        <span>Subtotal:</span>
        <span>AED {subtotal.toFixed(2)}</span>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem', lineHeight: '1.4' }}>
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

      <div className="mobile-only">
        <HelpText />
      </div>
    </aside>
  );
}

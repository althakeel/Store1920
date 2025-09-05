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
        color: '#fff',
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
          color: '#fff',
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

export default function CheckoutRight({ cartItems, formData, createOrder, clearCart, orderId }) {
  const [alert, setAlert] = useState({ message: '', type: 'info' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [coinDiscount, setCoinDiscount] = useState(0);

  // -----------------------------
  // Robust price calculation
  // -----------------------------
const itemsTotal = cartItems.reduce((acc, item) => {
  const rawPrice = item.prices?.price ?? item.price ?? 0;
  const cleanPrice = String(rawPrice).replace(/[^0-9.]/g, '');
  const priceFloat = parseFloat(cleanPrice) || 0;
  const quantity = parseInt(item.quantity, 10) || 1;

  return acc + priceFloat * quantity;
}, 0);


  const subtotal = Math.max(0, itemsTotal - discount - coinDiscount);
  const totalWithShipping = subtotal; // shipping removed

  const showAlert = (message, type = 'info') => setAlert({ message, type });

  // -----------------------------
  // Place order handler
  // -----------------------------
  const handlePlaceOrder = async () => {
    console.log('--- Place Order Start ---');
    console.log('Form Data:', formData);
    console.log('Cart Items:', cartItems);
    console.log('Items total:', itemsTotal);
    console.log('Discount:', discount, 'Coin Discount:', coinDiscount);
    console.log('Subtotal:', subtotal);
    console.log('Total With Shipping (no shipping):', totalWithShipping);

    if (!formData.paymentMethod) {
      console.error('No payment method selected.');
      return showAlert('Select a payment method', 'error');
    }

    setIsPlacingOrder(true);
    try {
      const id = orderId || (await createOrder());
      console.log('Order created:', id);

      if (formData.paymentMethod === 'cod') {
        clearCart();
        window.location.href = `/order-success?order_id=${id.id || id}`;
        return;
      }

      if (['paymob', 'card'].includes(formData.paymentMethod)) {
        const fullName = formData.shipping.fullName || 'First Last';
        const nameParts = fullName.split(' ');

        const normalized = {
          first_name: nameParts[0] || 'First',
          last_name: nameParts[1] || 'Last',
          email: formData.billing?.email || 'customer@example.com',
          phone_number: formData.shipping.phone || '+971501234567',
          street: formData.shipping.address1 || 'NA',
          apartment: formData.shipping.address2 || '',
          floor: '',
          city: formData.shipping.city || 'Dubai',
          state: formData.shipping.state || 'DXB',
          country: 'AE',
          postal_code: '00000',
        };

        try {
          const res = await fetch(
            'https://db.store1920.com/wp-json/custom/v1/paymob-intent',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
  amount: Number(totalWithShipping), // ensure it's a number
  order_id: id.id || id,
  billing: normalized,
  shipping: normalized,
  billingSameAsShipping: true,
}),
            }
          );

          const data = await res.json();

          if (!res.ok) throw new Error(data.message || 'Failed to initiate Paymob payment.');
          if (!data.checkout_url) throw new Error('Paymob checkout URL not returned.');

          window.location.href = data.checkout_url;
        } catch (err) {
          showAlert(err.message || 'Failed to initiate Paymob payment.', 'error');
        }
      } else {
        showAlert('Selected payment method not supported yet.', 'error');
      }
    } catch (err) {
      showAlert(err.message || 'Failed to place order.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // -----------------------------
  // Coupon handling
  // -----------------------------
  const handleCoupon = (couponData) => {
    if (!couponData) {
      setDiscount(0);
      showAlert('Coupon removed or invalid.', 'error');
      return;
    }

    let discountAmount =
      couponData.discount_type === 'percent'
        ? (itemsTotal * parseFloat(couponData.amount)) / 100
        : parseFloat(couponData.amount);

    discountAmount = Math.min(discountAmount, itemsTotal);

    setDiscount(discountAmount);
    showAlert(`Coupon applied! You saved AED ${discountAmount.toFixed(2)}`, 'success');
  };

  // -----------------------------
  // Coin handling
  // -----------------------------
  const handleCoinRedemption = ({ coinsUsed, discountAED }) => {
    setCoinDiscount(discountAED);
    showAlert(`You redeemed ${coinsUsed} coins for AED ${discountAED}`, 'success');
  };

  const handleRemoveCoinDiscount = () => {
    setCoinDiscount(0);
    showAlert('Coin discount removed.', 'info');
  };

  // -----------------------------
  // Button style & label
  // -----------------------------
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
      case 'paymob':
        return { ...base, backgroundColor: '#22c55e' };
      case 'card':
        return { ...base, backgroundColor: '#2563eb' };
      default:
        return { ...base, backgroundColor: '#10b981' };
    }
  };

  const getButtonLabel = () => {
    const labels = {
      cod: 'Cash on Delivery',
      card: 'Card',
      apple_pay: 'Apple Pay',
      paymob: 'Paymob',
    };
    const label = labels[formData.paymentMethod] || 'Order';
    return isPlacingOrder ? `Placing Order with ${label}...` : `Place Order with ${label}`;
  };

  // -----------------------------
  // JSX Rendering
  // -----------------------------
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

      <div className="summaryRow discount" style={{ color: '#fe6c03', fontWeight: 600 }}>
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
              fontSize: '12px',
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

      <div className="summaryRowCR" style={{ fontWeight: 700 }}>
        <span>Total:</span>
        <span>AED {totalWithShipping.toFixed(2)}</span>
      </div>

      <p className="checkoutNote">
        All fees and applicable taxes are included, and no additional charges will apply.
      </p>

      <p className="checkoutTerms">
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
        {getButtonLabel()}
      </button>

      <TrustSection />

      <div className="mobile-only">
        <HelpText />
      </div>
    </aside>
  );
}

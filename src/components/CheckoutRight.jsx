import React, { useState, useEffect } from 'react';
import '../assets/styles/checkout/CheckoutRight.css';
import TrustSection from './checkout/TrustSection';
import CouponDiscount from './sub/account/CouponDiscount';
import CoinBalance from './sub/account/CoinBalace';
import HelpText from './HelpText';

// -----------------------------
// Alert Component
// -----------------------------
function Alert({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  const colors = { info: '#2f86eb', success: '#28a745', error: '#dc3545' };

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
        }}
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
}

// -----------------------------
// Utility function
// -----------------------------
const parsePrice = (raw) => {
  if (typeof raw === 'object' && raw !== null) {
    raw = raw.price ?? raw.regular_price ?? raw.sale_price ?? 0;
  }
  const cleaned = String(raw).replace(/,/g, '').replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};

// -----------------------------
// CheckoutRight Component
// -----------------------------
export default function CheckoutRight({ cartItems, formData, createOrder, clearCart, orderId }) {
  const [alert, setAlert] = useState({ message: '', type: 'info' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [coinDiscount, setCoinDiscount] = useState(0);

  const showAlert = (message, type = 'info') => setAlert({ message, type });

  // -----------------------------
  // Totals
  // -----------------------------
  const itemsTotal = cartItems.reduce((acc, item) => {
    const price = parsePrice(item.prices?.price ?? item.price);
    const quantity = parseInt(item.quantity, 10) || 1;
    return acc + price * quantity;
  }, 0);

  const subtotal = Math.max(0, itemsTotal - discount - coinDiscount);
  const deliveryFee = subtotal < 100 ? 0 : 0;
  const totalWithDelivery = subtotal + deliveryFee;
  const amountToSend = Math.max(totalWithDelivery, 0.01);

  // -----------------------------
  // Address validation
  // -----------------------------
  const requiredFields = ['first_name', 'last_name', 'email', 'phone_number', 'street', 'city', 'country'];
  const shippingOrBilling = formData.shipping || formData.billing || {};
  const isAddressComplete = requiredFields.every((f) => shippingOrBilling[f]?.trim());
  const canPlaceOrder = isAddressComplete;

  // -----------------------------
  // Capture Order Items
  // -----------------------------
  const captureOrderItems = async (orderId, cartItems, customer) => {
    const items = cartItems.map((item) => ({
      id: item.wooId || item.id || 0,
      name: item.name || item.title,
      price: parseFloat(item.prices?.price ?? item.price ?? 0),
      quantity: parseInt(item.quantity, 10) || 1,
    }));

    await fetch('https://db.store1920.com/wp-json/custom/v1/capture-order-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, customer, items }),
    });
  };

  // -----------------------------
  // Place Order
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return showAlert('Please fill all required address fields.', 'error');
    if (!formData.paymentMethod) return showAlert('Select a payment method', 'error');

    setIsPlacingOrder(true);
    try {
      const id = orderId || (await createOrder());
      await captureOrderItems(id, cartItems, shippingOrBilling);

      // COD
      if (formData.paymentMethod === 'cod') {
        clearCart();
        window.location.href = `/order-success?order_id=${id.id || id}`;
        return;
      }

      // Stripe Checkout
     // Stripe Checkout
if (formData.paymentMethod === 'stripe') {
  const normalized = {
    first_name: shippingOrBilling.first_name || 'First',
    last_name: shippingOrBilling.last_name || 'Last',
    email: shippingOrBilling.email || 'customer@example.com',
  };

  const payload = {
    amount: amountToSend,
    order_id: id.id || id,
    customer: normalized,
    success_url: 'http://localhost:3000/order-success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/checkout?cancelled=true',
  };

  // 👇 FIXED ROUTE VERSION
  const res = await fetch('https://db.store1920.com/wp-json/custom/v3/stripe-direct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log('✅ Stripe SessionDATA =>', data.checkout_url);

  if (!res.ok) throw new Error(data.message || 'Failed to start Stripe session.');
  if (!data.checkout_url) throw new Error('Stripe checkout URL missing.');

  window.location.href = data.checkout_url;
  return;
}


      // Paymob
      if (['paymob', 'card', 'tabby', 'tamara'].includes(formData.paymentMethod)) {
        const payload = { amount: amountToSend, order_id: id.id || id, provider: formData.paymentMethod };
        const res = await fetch('https://db.store1920.com/wp-json/custom/v1/paymob-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to initiate payment.');
        window.location.href = data.checkout_url || data.payment_url;
        return;
      }

      showAlert('Selected payment method not supported yet.', 'error');
    } catch (err) {
      console.error('❌ STRIPE FETCH ERROR:', err);
      showAlert(err.message || 'Failed to place order.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // -----------------------------
  // Coupon & Coins
  // -----------------------------
  const handleCoupon = (couponData) => {
    if (!couponData) return showAlert('Coupon invalid or removed.', 'error');
    const discountAmount =
      couponData.discount_type === 'percent'
        ? (itemsTotal * parseFloat(couponData.amount)) / 100
        : parseFloat(couponData.amount);
    setDiscount(Math.min(discountAmount, itemsTotal));
    showAlert(`Coupon applied! You saved AED ${discountAmount.toFixed(2)}`, 'success');
  };

  const handleCoinRedemption = ({ coinsUsed, discountAED }) => {
    setCoinDiscount(Math.min(discountAED, itemsTotal));
    showAlert(`You redeemed ${coinsUsed} coins for AED ${discountAED}`, 'success');
  };

  const handleRemoveCoinDiscount = () => {
    setCoinDiscount(0);
    showAlert('Coin discount removed.', 'info');
  };

  // -----------------------------
  // Button Styles
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
    const colors = {
      cod: '#f97316',
      paymob: '#22c55e',
      stripe: '#2563eb',
      tabby: '#077410d4',
      tamara: '#ec4899',
      default: '#10b981',
    };
    return { ...base, backgroundColor: colors[formData.paymentMethod] || colors.default };
  };

  const getButtonLabel = () => {
    const labels = { cod: 'Cash on Delivery', stripe: 'Stripe', paymob: 'Paymob', tabby: 'Tabby', tamara: 'Tamara' };
    const label = labels[formData.paymentMethod] || 'Order';
    return isPlacingOrder ? `Placing Order with ${label}...` : `Place Order with ${label}`;
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <aside className="checkoutRightContainer">
      <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: 'info' })} />
      <h2>Order Summary</h2>

      <CouponDiscount onApplyCoupon={handleCoupon} />

      <div className="summaryRowCR"><span>Item(s) total:</span><span>AED {itemsTotal.toFixed(2)}</span></div>
      {discount > 0 && <div className="summaryRowCR" style={{ color: '#fe6c03' }}>Discount: -AED {discount.toFixed(2)}</div>}
      {coinDiscount > 0 && (
        <div className="summaryRowCR" style={{ color: 'green' }}>
          Coin discount: -AED {coinDiscount.toFixed(2)}{' '}
          <button onClick={handleRemoveCoinDiscount} style={{ color: '#dc3545', marginLeft: 10 }}>×</button>
        </div>
      )}
      <div className="summaryRowCR"><span>Subtotal:</span><span>AED {subtotal.toFixed(2)}</span></div>
      <div className="summaryRowCR" style={{ fontWeight: 700 }}><span>Total:</span><span>AED {totalWithDelivery.toFixed(2)}</span></div>

      <button className="placeOrderBtnCR" onClick={handlePlaceOrder} disabled={isPlacingOrder || !canPlaceOrder} style={getButtonStyle()}>
        {getButtonLabel()}
      </button>

      <TrustSection />
      <HelpText />
    </aside>
  );
}

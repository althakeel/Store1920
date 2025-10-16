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
      >
        ×
      </button>
    </div>
  );
}

const parsePrice = (raw) => {
  if (typeof raw === 'object' && raw !== null)
    raw = raw.price ?? raw.regular_price ?? raw.sale_price ?? 0;
  const cleaned = String(raw).replace(/,/g, '').replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};

export default function CheckoutRight({ cartItems, formData, createOrder, clearCart, orderId }) {
  const [alert, setAlert] = useState({ message: '', type: 'info' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [coinDiscount, setCoinDiscount] = useState(0);

  const showAlert = (message, type = 'info') => setAlert({ message, type });

  const itemsTotal = cartItems.reduce((acc, item) => {
    const price = parsePrice(item.prices?.price ?? item.price);
    const qty = parseInt(item.quantity, 10) || 1;
    return acc + price * qty;
  }, 0);

  const subtotal = Math.max(0, itemsTotal - discount - coinDiscount);
  const totalWithDelivery = subtotal;
  const amountToSend = Math.max(totalWithDelivery, 0.01);

  const requiredFields = ['first_name', 'last_name', 'email', 'phone_number', 'street', 'city', 'country'];
  const shippingOrBilling = formData.shipping || formData.billing || {};
  const isAddressComplete = requiredFields.every((f) => shippingOrBilling[f]?.trim());
  const canPlaceOrder = isAddressComplete;

  // -----------------------------
  // Capture order items
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
  // Stripe Checkout Flow
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return showAlert('Please fill all required address fields.', 'error');
    if (!formData.paymentMethod) return showAlert('Select a payment method', 'error');

    setIsPlacingOrder(true);
    try {
      const id = orderId || (await createOrder());
      await captureOrderItems(id, cartItems, shippingOrBilling);

      if (formData.paymentMethod === 'cod') {
        clearCart();
        window.location.href = `/order-success?order_id=${id.id || id}`;
        return;
      }

      if (formData.paymentMethod === 'stripe') {
        const normalized = {
          first_name: shippingOrBilling.first_name || 'First',
          last_name: shippingOrBilling.last_name || 'Last',
          email: shippingOrBilling.email || 'customer@example.com',
        };

        const payload = {
          amount: amountToSend,
          order_id: id.id || id,
          billing: normalized,
        };

        const res = await fetch('https://db.store1920.com/wp-json/custom/v3/stripe-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log('✅ Stripe Session =>', data);

        if (!res.ok) throw new Error(data.message || 'Failed to start Stripe session.');
        if (!data.checkout_url) throw new Error('Stripe checkout URL missing.');

        window.location.href = data.checkout_url;
      }
    } catch (err) {
      console.error('❌ STRIPE FETCH ERROR:', err);
      showAlert(err.message || 'Failed to place order.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCoupon = (couponData) => {
    if (!couponData) return showAlert('Invalid coupon.', 'error');
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

  const getButtonStyle = () => ({
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontWeight: 600,
    padding: '14px 36px',
    cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
    backgroundColor: formData.paymentMethod === 'stripe' ? '#2563eb' : '#10b981',
  });

  const getButtonLabel = () => {
    const labels = { cod: 'Cash on Delivery', stripe: 'Stripe' };
    const label = labels[formData.paymentMethod] || 'Order';
    return isPlacingOrder ? `Placing Order with ${label}...` : `Place Order with ${label}`;
  };

  return (
    <aside className="checkoutRightContainer">
      <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: 'info' })} />
      <h2>Order Summary</h2>

      <CouponDiscount onApplyCoupon={handleCoupon} />

      <div className="summaryRowCR"><span>Item(s) total:</span><span>AED {itemsTotal.toFixed(2)}</span></div>
      {discount > 0 && <div className="summaryRowCR" style={{ color: '#fe6c03' }}>Discount: -AED {discount.toFixed(2)}</div>}
      {coinDiscount > 0 && <div className="summaryRowCR" style={{ color: 'green' }}>Coins: -AED {coinDiscount.toFixed(2)}</div>}

      <div className="summaryRowCR"><span>Total:</span><span>AED {totalWithDelivery.toFixed(2)}</span></div>

      <button
        className="placeOrderBtnCR"
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder || !canPlaceOrder}
        style={getButtonStyle()}
      >
        {getButtonLabel()}
      </button>

      <TrustSection />
      <HelpText />
    </aside>
  );
}

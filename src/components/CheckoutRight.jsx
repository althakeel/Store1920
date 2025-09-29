// src/components/checkout/CheckoutRight.jsx
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
          lineHeight: 1,
        }}
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
}

// -----------------------------
// Utility: parse price safely
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
  const [hoverMessage, setHoverMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [coinDiscount, setCoinDiscount] = useState(0);

  const showAlert = (message, type = 'info') => setAlert({ message, type });

  // -----------------------------
  // Calculate totals
  // -----------------------------
  const itemsTotal = cartItems.reduce((acc, item) => {
    const price = parsePrice(item.prices?.price ?? item.price);
    const quantity = parseInt(item.quantity, 10) || 1;
    return acc + price * quantity;
  }, 0);

  const subtotal = Math.max(
    0,
    itemsTotal - Math.min(discount, itemsTotal) - Math.min(coinDiscount, itemsTotal)
  );

  // Delivery fee
  const DELIVERY_THRESHOLD = 100; // AED
  const DELIVERY_CHARGE = 10;     // AED
  const deliveryFee = subtotal < DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0;

  // Total including delivery
  const totalWithDelivery = subtotal + deliveryFee;
  const MIN_PAYMOB_AMOUNT = 0.01;
  const amountToSend = Math.max(totalWithDelivery, MIN_PAYMOB_AMOUNT);

  // -----------------------------
  // Check if required address fields are complete
  // -----------------------------
  const requiredFields = [
    'first_name',
    'last_name',
    'email',
    'phone_number',
    'street',
    'city',
    'country',
  ];
  const shippingOrBilling = formData.shipping || formData.billing || {};
  const isAddressComplete = requiredFields.every(field => shippingOrBilling[field]?.trim());
  const canPlaceOrder = isAddressComplete;

  // -----------------------------
  // Capture order items
  // -----------------------------
  const captureOrderItems = async (orderId, cartItems, customer) => {
    const items = cartItems.map(item => ({
      id: item.id || 0,
      name: item.name || item.title,
      price: parseFloat(item.prices?.price ?? item.price ?? 0),
      quantity: parseInt(item.quantity, 10) || 1
    }));

    await fetch('https://db.store1920.com/wp-json/custom/v1/capture-order-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        customer: {
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
          phone_number: customer.phone_number,
        },
        items
      })
    });
  };

  // -----------------------------
  // Place order
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!formData.paymentMethod) return showAlert('Select a payment method', 'error');
    setIsPlacingOrder(true);

    try {
      const id = orderId || (await createOrder());
      await captureOrderItems(id, cartItems, formData.shipping || formData.billing || {});

      // Cash on Delivery
      if (formData.paymentMethod === 'cod') {
        clearCart();
        window.location.href = `/order-success?order_id=${id.id || id}`;
        return;
      }

      // Paymob/Card
      if (['paymob', 'card'].includes(formData.paymentMethod)) {
        const shipping = formData.shipping || {};
        const normalized = {
          first_name: shipping.first_name?.trim() || 'First',
          last_name: shipping.last_name?.trim() || 'Last',
          email: shipping.email?.trim() || formData.billing?.email || 'customer@example.com',
          phone_number: shipping.phone_number?.startsWith('+')
            ? shipping.phone_number
            : `+${shipping.phone_number || '971501234567'}`,
          street: shipping.street?.trim() || '',
          apartment: shipping.apartment?.trim() || '',
          floor: shipping.floor?.trim() || '',
          city: shipping.city?.trim() ? shipping.city.charAt(0).toUpperCase() + shipping.city.slice(1) : 'Dubai',
          state: shipping.state?.trim() || 'DXB',
          country: 'AE',
          postal_code: shipping.postal_code?.trim() || '',
        };

        // Validation logic
        if (!isAddressComplete) {
          showAlert('Please fill all required address fields.', 'error');
          setIsPlacingOrder(false);
          return;
        }

        const payload = {
          amount: amountToSend,
          order_id: id.id || id,
          billing: normalized,
          shipping: normalized,
          billingSameAsShipping: true,
          items: [{
            name: `Order ${id.id || id}`,
            amount: amountToSend,
            quantity: 1,
            description: 'Order from store1920.com',
          }],
        };

        try {
          const res = await fetch('https://db.store1920.com/wp-json/custom/v1/paymob-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to initiate Paymob payment.');
          if (!data.checkout_url) throw new Error('Paymob checkout URL not returned.');
          window.location.href = data.checkout_url;
        } catch (err) {
          console.error('❌ PAYMOB FETCH ERROR:', err);
          showAlert(err.message || 'Failed to initiate Paymob payment.', 'error');
        }
      } else {
        showAlert('Selected payment method not supported yet.', 'error');
      }
    } catch (err) {
      console.error('❌ ORDER PLACEMENT ERROR:', err);
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
      return showAlert('Coupon removed or invalid.', 'error');
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
    setCoinDiscount(Math.min(discountAED, itemsTotal));
    showAlert(`You redeemed ${coinsUsed} coins for AED ${discountAED}`, 'success');
  };

  const handleRemoveCoinDiscount = () => {
    setCoinDiscount(0);
    showAlert('Coin discount removed.', 'info');
  };

  // -----------------------------
  // Button styles and label
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
      case 'apple_pay': return { ...base, backgroundColor: '#000' };
      case 'cod': return { ...base, backgroundColor: '#f97316' };
      case 'paymob': return { ...base, backgroundColor: '#22c55e' };
      case 'card': return { ...base, backgroundColor: '#2563eb' };
      default: return { ...base, backgroundColor: '#10b981' };
    }
  };

  const getButtonLabel = () => {
    const labels = { cod: 'Cash on Delivery', card: 'Card', apple_pay: 'Apple Pay', paymob: 'Paymob' };
    const label = labels[formData.paymentMethod] || 'Order';
    return isPlacingOrder ? `Placing Order with ${label}...` : `Place Order with ${label}`;
  };

  // -----------------------------
  // Render JSX
  // -----------------------------
  return (
    <aside className="checkoutRightContainer">
      <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: 'info' })} />

      <h2>Order Summary</h2>
      <CouponDiscount onApplyCoupon={handleCoupon} />

      <div className="summaryRowCR">
        <span>Item(s) total:</span>
        <span>AED {itemsTotal.toFixed(2)}</span>
      </div>

      <div className="summaryRow discount" style={{ color: '#fe6c03', fontWeight: 600 }}>
        <span>Item(s) discount:</span>
        <span>-AED {discount.toFixed(2)}</span>
      </div>

      <CoinBalance onCoinRedeem={handleCoinRedemption} />
      {coinDiscount > 0 && (
        <div className="summaryRow" style={{ color: 'green', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span>Coin discount:</span>
            <span style={{ marginLeft: 8 }}>-AED {coinDiscount.toFixed(2)}</span>
          </div>
          <button
            onClick={handleRemoveCoinDiscount}
            style={{ background: 'transparent', border: 'none', color: '#dc3545', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
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

      {deliveryFee > 0 && (
        <div className="summaryRowCR" style={{ color: '#fe6c03', fontWeight: 600 }}>
          <span>Delivery Fee:</span>
          <span>AED {deliveryFee.toFixed(2)}</span>
        </div>
      )}

      <div className="summaryRowCR" style={{ fontWeight: 700 }}>
        <span>Total:</span>
        <span>AED {totalWithDelivery.toFixed(2)}</span>
      </div>

      <p className="checkoutNote">
        All fees and applicable taxes are included, and no additional charges will apply.
      </p>

      <p className="checkoutTerms">
        By submitting your order, you agree to our{' '}
        <a href="/terms-0f-use" target="_blank" rel="noopener noreferrer">Terms of Use</a>{' '}
        and{' '}
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
      </p>

      {/* Place Order Button with Hover Tooltip */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          className="placeOrderBtnCR"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !canPlaceOrder}
          style={getButtonStyle()}
          aria-disabled={isPlacingOrder || !canPlaceOrder}
          onMouseEnter={() => !canPlaceOrder && setHoverMessage('Please fill all required address fields.')}
          onMouseLeave={() => setHoverMessage('')}
        >
          {getButtonLabel()}
        </button>
        {hoverMessage && (
          <div
            style={{
              position: 'absolute',
              top: '-28px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#dc3545',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            {hoverMessage}
          </div>
        )}
      </div>

      <TrustSection />
      <div className="mobile-only">
        <HelpText />
      </div>

      {/* Mobile sticky area */}
      <div className="mobileStickyButton">
        <div className="mobileStickyContent">
          <span className="mobileSubtotal">AED {totalWithDelivery.toFixed(2)}</span>
          <button
            className="placeOrderBtnCR"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            style={getButtonStyle()}
            aria-disabled={isPlacingOrder}
          >
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </aside>
  );
}

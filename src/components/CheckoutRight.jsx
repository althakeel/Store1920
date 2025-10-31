// src/components/checkout/CheckoutRight.jsx
import React, { useState, useEffect } from 'react';
import '../assets/styles/checkout/CheckoutRight.css';
import TrustSection from './checkout/TrustSection';
import CouponDiscount from './sub/account/CouponDiscount';
import CoinBalance from './sub/account/CoinBalace';
import Tabby from '../assets/images/Footer icons/3.webp'
import Tamara from '../assets/images/Footer icons/6.webp'

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

  const itemsTotal = cartItems.reduce((acc, item) => {
    const price = parsePrice(item.prices?.price ?? item.price);
    const quantity = parseInt(item.quantity, 10) || 1;
    return acc + price * quantity;
  }, 0);

  const subtotal = Math.max(0, itemsTotal - discount - coinDiscount);
  const totalWithDelivery = subtotal;
  const amountToSend = Math.max(totalWithDelivery, 0.01);

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
  const isAddressComplete = requiredFields.every((f) => shippingOrBilling[f]?.trim());
  const canPlaceOrder = isAddressComplete;

  // Capture order items
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
      body: JSON.stringify({
        order_id: orderId,
        customer: {
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
          phone_number: customer.phone_number,
        },
        items,
      }),
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

      // ✅ STRIPE FLOW
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
          frontend_success: window.location.origin + '/order-success',
        };

        try {
          const res = await fetch('https://db.store1920.com/wp-json/custom/v3/stripe-direct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          console.log('✅ Stripe Session =>', data);
          if (!res.ok || !data.checkout_url) {
            throw new Error(data.error || 'Failed to start Stripe session.');
          }
          window.location.href = data.checkout_url;
          return;
        } catch (err) {
          console.error('❌ STRIPE FETCH ERROR:', err);
          showAlert(err.message || 'Failed to initiate Stripe payment.', 'error');
        }
      }

      // ✅ PAYMOB / TABBY / TAMARA / CARD FLOW
      if (['paymob', 'card', 'tabby', 'tamara'].includes(formData.paymentMethod)) {
        const normalized = {
          first_name: shippingOrBilling.first_name?.trim() || 'First',
          last_name: shippingOrBilling.last_name?.trim() || 'Last',
          email:
            shippingOrBilling.email?.trim() ||
            formData.billing?.email ||
            'customer@example.com',
          phone_number: shippingOrBilling.phone_number?.startsWith('+')
            ? shippingOrBilling.phone_number
            : `+${shippingOrBilling.phone_number || '971501234567'}`,
          street: shippingOrBilling.street?.trim() || '',
          city: shippingOrBilling.city?.trim() || 'Dubai',
          country: 'AE',
        };

        const payload = {
          amount: amountToSend,
          order_id: id.id || id,
          billing: normalized,
          shipping: normalized,
          billingSameAsShipping: true,
          items: [
            {
              name: `Order ${id.id || id}`,
              amount: amountToSend,
              quantity: 1,
              description: 'Order from store1920.com',
            },
          ],
          provider: formData.paymentMethod,
        };

        try {
          const res = await fetch('https://db.store1920.com/wp-json/custom/v1/paymob-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          console.log('✅ Paymob Response =>', data);

          if (!res.ok) throw new Error(data.message || 'Failed to initiate payment.');
          if (!data.checkout_url && !data.payment_url)
            throw new Error('Paymob checkout URL missing.');
          window.location.href = data.checkout_url || data.payment_url;
          return;
        } catch (err) {
          console.error('❌ PAYMOB FETCH ERROR:', err);
          showAlert(err.message || 'Failed to initiate Paymob payment.', 'error');
        }
      }
    } catch (err) {
      console.error('❌ ORDER ERROR:', err);
      showAlert(err.message || 'Failed to place order.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // -----------------------------
  // UI helpers
  // -----------------------------
  const getButtonStyle = () => {
    const base = {
      color: '#333',
      backgroundColor: '#ffffff',
      border: '1px solid #d1d5db',
      borderRadius: '25px',
      fontWeight: 600,
      padding: '14px 36px',
      cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
    };
    
    // Add hover effect styling
    const hoverStyle = {
      ':hover': {
        borderColor: '#9ca3af',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    };

    return base;
  };

  const getButtonLabel = () => {
    const labels = {
      cod: 'Cash on Delivery',
      stripe: 'Stripe',
      paymob: 'Paymob',
      card: 'Card',
      tabby: 'Tabby',
      tamara: 'Tamara',
    };

    const logoUrls = {
      tabby: Tabby,
      tamara: Tamara,
    };
    
    // For Tabby and Tamara, use the image URLs
    if ((formData.paymentMethod === 'tabby' || formData.paymentMethod === 'tamara')) {
      const logoUrl = logoUrls[formData.paymentMethod];
      const label = labels[formData.paymentMethod];
      const loadingText = isPlacingOrder ? `Placing Order with ${label}...` : `Place Order with `;
      
      // Add background colors for better visibility
      const logoStyle = {
        height: '38px',
        width: '60px',
        objectFit: 'contain',
        padding: '2px 4px',
        borderRadius: '4px',
      };
      
      return (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          {loadingText}
          {!isPlacingOrder && logoUrl && (
            <img 
              src={logoUrl} 
              alt={label}
              style={logoStyle}
            />
          )}
          {isPlacingOrder && label}
        </span>
      );
    }

    // Always show logo if we have one for other payment methods
    if (formData.paymentMethodLogo) {
      const label = labels[formData.paymentMethod] || 'Order';
      const loadingText = isPlacingOrder ? `Placing Order with ${label}...` : `Place Order with `;
      
      // Add background colors for COD and Card
      let logoStyle = {
        height: '32px',
        width: 'auto',
        objectFit: 'contain',
        padding: '2px 4px',
        borderRadius: '4px',
      };

      // Set background color based on payment method
      if (formData.paymentMethod === 'cod') {
        logoStyle.backgroundColor = '#fff7ed';
        logoStyle.border = '1px solid #f97316';
      } else if (formData.paymentMethod === 'card') {
        logoStyle.backgroundColor = '#f0fdf4';
        logoStyle.border = '1px solid #22c55e';
      } else {
        logoStyle.backgroundColor = '#f9fafb';
        logoStyle.border = '1px solid #d1d5db';
      }
      
      return (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loadingText}
          {!isPlacingOrder && (
            <img 
              src={formData.paymentMethodLogo} 
              alt={label}
              style={logoStyle}
            />
          )}
          {isPlacingOrder && label}
        </span>
      );
    }
    
    // Default text for other payment methods without logo
    const label = labels[formData.paymentMethod] || 'Order';
    return isPlacingOrder ? `Placing Order with ${label}...` : `Place Order with ${label}`;
  };

  return (
    <aside className="checkoutRightContainer">
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: 'info' })}
      />
      <h2>Order Summary</h2>

      <CouponDiscount onApplyCoupon={() => {}} />

      <div className="summaryRowCR">
        <span>Total:</span>
        <span>AED {totalWithDelivery.toFixed(2)}</span>
      </div>

      <button
        className="placeOrderBtnCR"
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder || !canPlaceOrder}
        style={getButtonStyle()}
      >
        {getButtonLabel()}
      </button>

      <TrustSection />
    </aside>
  );
}

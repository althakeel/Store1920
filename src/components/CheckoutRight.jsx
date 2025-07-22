import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const buildUrl = (endpoint) =>
  `${API_BASE}/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}`;

// Alert component to show messages
function Alert({ message, type = 'info', onClose }) {
  React.useEffect(() => {
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

export default function CheckoutRight({ cartItems, formData, onFormChange }) {
  const [alert, setAlert] = useState({ message: '', type: 'info' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Calculate subtotal dynamically from cart items
  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const total = subtotal; // No discount logic anymore

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      showAlert('Please fill in all required billing details.', 'error');
      return;
    }

    setIsPlacingOrder(true);

    const billing = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      address_1: formData.address,
      city: formData.city || '',
      state: formData.state || '',
      postcode: formData.postcode || '',
      country: formData.country || '',
      email: formData.email,
      phone: formData.phone || '',
    };

    const shipping = formData.shipToDifferentAddress
      ? {
          first_name: formData.shippingFirstName,
          last_name: formData.shippingLastName,
          address_1: formData.shippingAddress,
          city: formData.shippingCity || '',
          state: formData.shippingState || '',
          postcode: formData.shippingPostcode || '',
          country: formData.shippingCountry || '',
        }
      : { ...billing };

    const line_items = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const res = await axios.post(buildUrl('orders'), {
        // Remove payment_method, payment_method_title, set_paid for now
        billing,
        shipping,
        line_items,
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

  return (
    <aside className="checkoutRight">
      <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: 'info' })} />

      <h2>Order Summary</h2>

      <div className="summaryRow">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="summaryRow total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Removed coupon code and payment methods */}

      <button className="placeOrderBtn" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </aside>
  );
}

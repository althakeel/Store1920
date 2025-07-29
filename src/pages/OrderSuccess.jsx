import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/order-success.css';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract order ID from URL
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  const handleViewOrders = () => {
    navigate('/myaccount/orders');
  };

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <h2>✅ Order Placed Successfully!</h2>
        {orderId && (
          <p>Your Order ID: <strong>#{orderId}</strong></p>
        )}
        <p>Thank you for shopping with us.</p>
        <button onClick={handleViewOrders} className="view-orders-btn">
          View My Orders
        </button>
      </div>
    </div>
  );
}

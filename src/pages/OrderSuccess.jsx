import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { getOrderById } from "../api/woocommerce";
import "../assets/styles/OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  const [animate, setAnimate] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  
  useEffect(() => {
    //Clear cart when success page loads
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    // ✅ if user manually opens this page or no order_id present
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }
   
    setAnimate(true);

    // ✅ Prevent going back entirely
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Push a dummy state and keep re-pushing if back is attempted
    blockBack();
    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, [navigate, orderId]);

  const handleTrackOrder = () => {
    if (orderId) navigate(`/track-order?order_id=${orderId}`);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    alert('Order ID copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <div className="loading-spinner">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order || !orderId) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <div className="error-message">Order not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        {/* Header Section */}
        <div className="order-header">
          <div className="success-icon">✓</div>
          <h1 className="thank-you-title">Thank you</h1>
          <p className="thank-you-subtitle">Thank you. Your order has been received.</p>
          
          <button className="order-btn" onClick={() => navigate('/orders')}>
            Order no.
          </button>
        </div>

        {/* Order Number Section */}
        <div className="order-number-section">
          <h2 className="order-id" onClick={handleCopyOrderId}>
            #S{order.id}
          </h2>
          <p className="copy-order-text" onClick={handleCopyOrderId}>
            📋 Copy order number
          </p>
        </div>

        {/* Order Details Tabs */}
        <div className="order-tabs">
          <button className="tab-btn active">Order details</button>
        </div>

        {/* Order Info Grid */}
        <div className="order-info-grid">
          <div className="info-item">
            <span className="info-label">Order no.:</span>
            <span className="info-value">S{order.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Order date:</span>
            <span className="info-value">{new Date(order.date_created).toLocaleDateString('en-GB')}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total:</span>
            <span className="info-value">د.إ {parseFloat(order.total).toFixed(3)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Payment method:</span>
            <span className="info-value">{order.payment_method_title || 'COD'}</span>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-section">
          <button className="order-summary-btn">Order summary</button>
        </div>

        {/* Products Table */}
        <div className="products-table">
          <div className="table-header">
            <span className="product-header">Product</span>
            <span className="total-header">Total</span>
          </div>
          
          {order.line_items.map((item) => (
            <div key={item.id} className="table-row">
              <div className="product-info">
                <div className="product-image">
                  {item.image?.src ? (
                    <img src={item.image.src} alt={item.name} />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      No Image
                    </div>
                  )}
                </div>
                <div className="product-details">
                  <div className="product-name">[{item.product_id}] {item.name}</div>
                  <div className="product-quantity">× {item.quantity}</div>
                </div>
              </div>
              <div className="product-total">د.إ {parseFloat(item.total).toFixed(3)}</div>
            </div>
          ))}

          {/* Summary Section */}
          <div className="order-summary-details">
            <div className="summary-row">
              <span className="summary-label">Items</span>
              <span className="summary-value">د.إ {parseFloat(order.total).toFixed(3)}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Discount</span>
              <span className="summary-value"></span>
            </div>
            
            {order.shipping_total && parseFloat(order.shipping_total) > 0 && (
              <div className="summary-row">
                <span className="summary-label">Shipping & handling</span>
                <span className="summary-value">د.إ {parseFloat(order.shipping_total).toFixed(0)}</span>
              </div>
            )}
            
            <div className="summary-row total-row">
              <span className="summary-label">Total</span>
              <span className="summary-value">د.إ {parseFloat(order.total).toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Track Order Button */}
        <div className="track-order-section">
          <button className="track-order-btn" onClick={handleTrackOrder}>
            Track Your Order
          </button>
        </div>

        {/* Note for guests */}
        {!user && (
          <div className="guest-note">
            <p>Note: Guests can only track their order. Updates will be sent via WhatsApp.</p>
          </div>
        )}

        {/* Popular Search Terms */}
        <div className="popular-search-section">
          <h3>Most popular search words</h3>
          <div className="search-tags">
            <span className="search-tag">Mosquito killer machine</span>
            <span className="search-tag">Electric mosquito killer</span>
            <span className="search-tag">Installment mobile phones</span>
            <span className="search-tag">Hair curling iron</span>
            <span className="search-tag">Portable Screen</span>
            <span className="search-tag">Oral irrigator</span>
            <span className="search-tag">Water Flosser</span>
            <span className="search-tag">Water tooth flosser</span>
            <span className="search-tag">Toothbrush</span>
            <span className="search-tag">Oral</span>
            <span className="search-tag">Electric toothbrush</span>
            <span className="search-tag">Bluetooth headphones</span>
            <span className="search-tag">Wireless earphones</span>
            <span className="search-tag">Travel kit</span>
            <span className="search-tag">Coffee bean grinder</span>
            <span className="search-tag">Treadmill</span>
            <span className="search-tag">Coffee maker machine</span>
            <span className="search-tag">Coffee grinder</span>
            <span className="search-tag">Home projector</span>
            <span className="search-tag">Candle Machines</span>
            <span className="search-tag">Gym equipment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

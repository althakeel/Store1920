import React, { useState } from 'react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  const pageContainerStyle = {
    minHeight: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '40px 10px', // ← 10px left and right padding
    backgroundColor: '#f9f9f9',
  };

  const contentWrapperStyle = {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    padding: '25px 20px',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '20px',
    marginBottom: '16px',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '14px',
  };

  const buttonStyle = {
    padding: '10px 22px',
    backgroundColor: '#ff6a00',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
    marginBottom: '20px',
  };

  const infoStyle = {
    fontSize: '14px',
    color: '#555',
    textAlign: 'left',
    marginTop: '10px',
  };

  const legalStyle = {
    fontSize: '12px',
    color: '#999',
    marginTop: '25px',
    lineHeight: '1.6',
    textAlign: 'left',
  };

  const handleTrack = () => {
    if (!orderId.trim()) return;

    // Dummy order data
    setOrderDetails({
      id: orderId,
      status: 'Shipped',
      shippingMethod: 'Express Delivery',
      estimatedDelivery: 'Aug 5, 2025',
      total: '$149.99',
      trackingUrl: 'https://courier.example.com/track/' + orderId,
    });
  };

  return (
    <div style={pageContainerStyle}>
      <div style={contentWrapperStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>Track Your Order</h2>
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={handleTrack}>
            Track
          </button>

          {orderDetails && (
            <div style={infoStyle}>
              <p><strong>Order ID:</strong> {orderDetails.id}</p>
              <p><strong>Status:</strong> {orderDetails.status}</p>
              <p><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}</p>
              <p><strong>Shipping Method:</strong> {orderDetails.shippingMethod}</p>
              <p><strong>Total:</strong> {orderDetails.total}</p>
              <p>
                <strong>Tracking Link:</strong>{' '}
                <a
                  href={orderDetails.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Shipment
                </a>
              </p>
            </div>
          )}

          <div style={legalStyle}>
            <p><strong>Note:</strong> Delivery estimates may vary depending on location and courier performance.</p>
            <p>
              By tracking your order, you agree to our{' '}
              <a href="/terms" style={{ color: '#888' }}>Terms of Service</a> and{' '}
              <a href="/privacy" style={{ color: '#888' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

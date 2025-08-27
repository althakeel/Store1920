import React, { useState, useEffect, useCallback } from 'react';
import '../../assets/styles/checkoutleft/paymentmethods.css';
import CreditCardIcon from '../../assets/images/common/credit-card.png';

const PaymentMethods = ({ onMethodSelect, subtotal = 0, orderId = null }) => {
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [iframeUrl, setIframeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentOptions = [
    {
      id: 'cod',
      title: 'Cash On Delivery',
      logo: 'https://db.store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp',
      description: '',
    },
    {
      id: 'paymob',
      title: 'Paymob',
      logo: CreditCardIcon,
      description: 'Pay securely using your credit/debit card via Paymob',
    },
  ];

  const paymobCardImages = [
    'https://db.store1920.com/wp-content/uploads/2025/07/058c1e09-2f89-4769-9fd9-a3cac76e13e5-1.webp',
    'https://db.store1920.com/wp-content/uploads/2025/07/6fad9cde-cc9c-4364-8583-74bb32612cea.webp',
    'https://db.store1920.com/wp-content/uploads/2025/07/3a626fff-bbf7-4a26-899a-92c42eef809a.png.slim_.webp',
    'https://db.store1920.com/wp-content/uploads/2025/07/b79a2dc3-b089-4cf8-a907-015a25ca12f2.png.slim_.webp',
  ];

  const handleSelection = (id, title) => {
    setSelectedMethod(id);
    setIframeUrl(null); // reset iframe if switching method
    setError('');
    if (onMethodSelect) onMethodSelect(id, title);
  };

  // Fetch Paymob iframe URL
  const fetchPaymobIframe = useCallback(async () => {
    if (!orderId || selectedMethod !== 'paymob') return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://db.store1920.com/wp-json/custom/v3/paymob-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: subtotal, order_id: orderId }), // send decimal AED
      });

      const data = await response.json();
      if (data.iframe_url) {
        setIframeUrl(data.iframe_url);
      } else {
        console.error('Paymob Init Error:', data);
        setIframeUrl(null);
        setError('Paymob checkout not available.');
      }
    } catch (err) {
      console.error('Paymob fetch error:', err);
      setIframeUrl(null);
      setError('Failed to load Paymob checkout.');
    } finally {
      setLoading(false);
    }
  }, [subtotal, orderId, selectedMethod]);

  // Auto-fetch iframe when method or orderId changes
  useEffect(() => {
    if (selectedMethod === 'paymob') fetchPaymobIframe();
  }, [selectedMethod, orderId, fetchPaymobIframe]);

  return (
    <div className="payment-methods-wrapper">
      <h2 className="payment-heading">Payment Methods</h2>

      <div className="payment-options">
        {paymentOptions.map((method) => (
          <div
            key={method.id}
            className={`payment-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => handleSelection(method.id, method.title)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSelection(method.id, method.title);
            }}
          >
            <div className="payment-card-content">
              <div className="payment-card-header">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === method.id}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelection(method.id, method.title);
                  }}
                />
                <img src={method.logo} alt={method.title} className="payment-logo" />
                <span className="payment-title">{method.title}</span>
              </div>

              {method.id === 'paymob' && (
                <div className="card-logos-top-right">
                  {paymobCardImages.map((img, index) => (
                    <img key={index} src={img} alt={`Paymob card ${index}`} className="card-logo" />
                  ))}
                </div>
              )}

              {method.description && <p className="payment-desc">{method.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {selectedMethod === 'paymob' && (
        <div className="paymob-iframe-wrapper">
          {loading && <p>Loading Paymob checkout...</p>}
          {iframeUrl && !loading && (
            <iframe
              src={iframeUrl}
              title="Paymob Checkout"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          )}
          {!iframeUrl && !loading && (
            <div style={{ color: '#dc3545', marginTop: '10px' }}>
              {error}
              <button onClick={fetchPaymobIframe} style={{ marginLeft: '10px' }}>
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;

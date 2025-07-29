import React, { useState, useEffect } from 'react';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const PaymentMethods = ({ onMethodSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [error, setError] = useState('');

  // Instead of fetching, we define payment methods here for clarity
  const paymentMethods = [
    {
      id: 'stripe',
      title: 'Credit/Debit Card (Stripe)',
      icon: '💳',
      description: 'Pay securely using your card via Stripe.',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      icon: '🅿️',
      description: 'Checkout quickly with your PayPal account.',
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay with cash upon delivery.',
    },
  ];

  const handleSelection = (methodId) => {
    setSelectedMethod(methodId);
    if (onMethodSelect) {
      onMethodSelect(methodId);
    }
  };

  return (
    <div className="payment-methods-wrapper">
      <h2 className="payment-heading">Choose a Payment Method</h2>

      {error && <div className="payment-error">{error}</div>}

      <div className="payment-options">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-option ${selectedMethod === method.id ? 'active' : ''}`}
            onClick={() => handleSelection(method.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSelection(method.id); }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => handleSelection(method.id)}
              aria-label={method.title}
            />
            <div className="payment-icon">{method.icon}</div>
            <div className="payment-details">
              <div className="payment-title">{method.title}</div>
              <div className="payment-description">{method.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

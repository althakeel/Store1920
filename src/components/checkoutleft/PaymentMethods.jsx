import React from 'react';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const PaymentMethods = ({ selectedMethod = 'cod', onMethodSelect }) => {
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
      logo: 'https://your-site.com/path-to-paymob-logo.png', // replace with actual Paymob logo URL
      description: 'Pay securely using Paymob gateway',
    },
  ];

  const handleSelection = (id) => {
    if (onMethodSelect) onMethodSelect(id);
  };

  return (
    <div className="payment-methods-wrapper">
      <h2 className="payment-heading">Payment Methods</h2>

      <div className="payment-options">
        {paymentOptions.map((method) => (
          <div
            key={method.id}
            className={`payment-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => handleSelection(method.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSelection(method.id);
            }}
          >
            <div className="payment-card-content">
              <div className="payment-card-header">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === method.id}
                  onChange={() => handleSelection(method.id)}
                />
                <img src={method.logo} alt={method.title} className="payment-logo" />
                <span className="payment-title">{method.title}</span>
              </div>
              {method.description && <p className="payment-desc">{method.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

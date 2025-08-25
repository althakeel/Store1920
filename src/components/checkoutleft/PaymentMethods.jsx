import React, { useState } from 'react';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const PaymentMethods = ({ onMethodSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentOptions = [
    {
      id: 'cod',
      title: 'Cash On Delivery',
      logo: 'https://db.store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp',
      description: '',
    },
    // Example for adding another method
    // {
    //   id: 'paymob',
    //   title: 'Paymob',
    //   logo: 'https://your-site.com/path-to-paymob-logo.png',
    //   description: 'Pay securely using Paymob gateway',
    // },
  ];

  const handleSelection = (id, title) => {
    setSelectedMethod(id);
    if (onMethodSelect) onMethodSelect(id, title);
  };

  const handleProceed = () => {
    // Here you continue checkout process
    alert(`Proceeding with ${selectedMethod}`);
  };

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
              {method.description && <p className="payment-desc">{method.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* <button
        className="proceed-btn"
        onClick={handleProceed}
        disabled={!selectedMethod} // 🔥 disabled until user selects
      >
        Continue
      </button> */}
    </div>
  );
};

export default PaymentMethods;

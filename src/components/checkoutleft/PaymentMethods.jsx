import React, { useState } from 'react';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const codLogoUrl = 'https://db.store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp';

const PaymentMethods = ({ onMethodSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState('cod');

  const handleSelection = (id) => {
    setSelectedMethod(id);
    if (onMethodSelect) onMethodSelect(id);
  };

  return (
    <div className="payment-methods-wrapper">
      <h2 className="payment-heading">Payment Methods</h2>

      <div className="payment-options">
        <div
          className={`payment-card ${selectedMethod === 'cod' ? 'selected' : ''}`}
          onClick={() => handleSelection('cod')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleSelection('cod');
          }}
        >
          <div className="payment-card-content">
            <div className="payment-card-header">
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedMethod === 'cod'}
                onChange={() => handleSelection('cod')}
              />
              <img src={codLogoUrl} alt="Cash On Delivery" className="payment-logo" />
              <span className="payment-title">Cash On Delivery</span>
            </div>
            {/* <p className="payment-desc">Non-refundable COD fee of AED16.53 applies.</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;

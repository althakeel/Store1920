import React from 'react';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const PaymentMethods = ({ selectedMethod, onMethodSelect }) => {
  const paymentOptions = [
    { id: 'cod', title: 'Cash On Delivery', description: 'Pay with cash on delivery' },
    { id: 'card', title: 'Credit/Debit Card', description: 'Pay with card' }
  ];

  return (
    <div className="payment-methods-wrapper">

            <h3 className="payment-section-title">Payment Method</h3>

      {paymentOptions.map(method => (
        <div
          key={method.id}
          className={`payment-card ${selectedMethod === method.id ? 'selected' : ''}`}
          onClick={() => onMethodSelect(method.id, method.title)}
        >
          <input type="radio" checked={selectedMethod === method.id} readOnly />
          <div className="payment-info">
            <span className="payment-title">{method.title}</span>
            <p className="payment-desc">{method.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;

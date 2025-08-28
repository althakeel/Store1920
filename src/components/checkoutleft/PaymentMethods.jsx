import React from 'react';
import CreditCardIcon from '../../assets/images/common/credit-card.png';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const PaymentMethods = ({ selectedMethod, onMethodSelect }) => {
  const paymentOptions = [
    { id: 'cod', title: 'Cash On Delivery', logo: '', description: 'Pay with cash on delivery' },
    { id: 'card', title: 'Credit/Debit Card', logo: CreditCardIcon, description: 'Pay with card' }
  ];

  return (
    <div className="payment-methods-wrapper">
      {paymentOptions.map(method => (
        <div
          key={method.id}
          className={`payment-card ${selectedMethod === method.id ? 'selected' : ''}`}
          onClick={() => onMethodSelect(method.id, method.title)}
        >
          <input type="radio" checked={selectedMethod === method.id} readOnly />
          {method.logo && <img src={method.logo} alt={method.title} />}
          <span>{method.title}</span>
          <p>{method.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;

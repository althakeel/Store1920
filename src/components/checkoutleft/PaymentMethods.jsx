import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CONSUMER_SECRET = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const buildUrl = (endpoint) =>
  `${API_BASE}/${endpoint}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

const PaymentMethods = ({ onMethodSelect }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(buildUrl('payment_gateways'));
        const enabled = response.data.filter(method => method.enabled);
        setPaymentMethods(enabled);
      } catch (err) {
        console.error('Failed to load payment methods:', err);
        setError('Unable to load payment methods.');
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleSelection = (methodId) => {
    setSelectedMethod(methodId);
    if (onMethodSelect) {
      onMethodSelect(methodId);
    }
  };

  return (
    <div className="payment-methods-wrapper">
      <h2 className="payment-heading1">Choose a Payment Method</h2>

      {error && <div className="payment-error">{error}</div>}

      <div className="payment-options">
        {paymentMethods.length === 0 && !error && (
          <div className="payment-loading">Loading payment options...</div>
        )}

        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-option ${selectedMethod === method.id ? 'active' : ''}`}
            onClick={() => handleSelection(method.id)}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => handleSelection(method.id)}
            />
            <div className="payment-info">
              <div className="payment-title">{method.title}</div>
              <div className="payment-icon">💳</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

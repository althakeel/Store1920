import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const API_BASE = 'https://store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const buildUrl = (endpoint) =>
  `${API_BASE}/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}`;

const PaymentMethods = ({ onMethodSelect }) => {
  const [selected, setSelected] = useState(null);
  const [methods, setMethods] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await axios.get(buildUrl('payment_gateways'));
        const enabledMethods = res.data.filter((method) => method.enabled);
        setMethods(enabledMethods);
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('Unable to load payment methods.');
      }
    };

    fetchMethods();
  }, []);

  const handleSelect = (id) => {
    setSelected(id);
    if (onMethodSelect) onMethodSelect(id);
  };

  return (
    <div className="payment-methods-wrapper">
      <h2 className="payment-heading">Choose a Payment Method</h2>
      {error && <div className="payment-error">{error}</div>}

      <div className="payment-options">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`payment-option ${selected === method.id ? 'active' : ''}`}
            onClick={() => handleSelect(method.id)}
          >
            <div className="payment-radio">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selected === method.id}
                onChange={() => handleSelect(method.id)}
              />
            </div>
            <div className="payment-info">
              <div className="payment-title">{method.title}</div>
              {/* Optional: replace with real logos */}
              <div className="payment-icon">💳</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

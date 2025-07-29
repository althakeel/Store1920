import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const PaymentMethods = ({ onMethodSelect }) => {
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE}/payment_gateways?consumer_key=${CK}&consumer_secret=${CS}`)
      .then((res) => {
        const available = res.data.filter((m) => m.enabled);
        setMethods(available);
      });
  }, []);

  const handleSelection = (id) => {
    setSelectedMethod(id);
    if (onMethodSelect) onMethodSelect(id);
  };

  const methodLogoMap = {
    stripe: 'https://db.store1920.com/wp-content/uploads/2025/07/da7f463a-916f-4d91-bcbb-047317a1c35e.png.slim_.webp',
    paypal: 'https://db.store1920.com/wp-content/uploads/2025/07/ec0c5d69-1717-4571-a193-9950ec73c8af.png.slim_.webp',
    tabby: 'https://db.store1920.com/wp-content/uploads/2025/07/b79a2dc3-b089-4cf8-a907-015a25ca12f2.png.slim_.webp',
    tamara: 'https://db.store1920.com/wp-content/uploads/2025/07/da7f463a-916f-4d91-bcbb-047317a1c35e.png.slim_.webp',
    cod: 'https://db.store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp',
    googlepay: 'https://db.store1920.com/wp-content/uploads/2025/07/c3e5eb19-1b60-4c2b-87e1-4528fb390cbf.png.slim_.webp',
    applepay: 'https://db.store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp'
  };

  const isInstallment = (id) => ['tabby', 'tamara'].includes(id);

  // Logos to show in stripe card details form
  const cardLogos = [
    { src: "https://db.store1920.com/wp-content/uploads/2025/07/da7f463a-916f-4d91-bcbb-047317a1c35e.png.slim_.webp", alt: "Visa" },
    { src: "https://db.store1920.com/wp-content/uploads/2025/07/c3e5eb19-1b60-4c2b-87e1-4528fb390cbf.png.slim_.webp", alt: "JCB" },
    { src: "https://db.store1920.com/wp-content/uploads/2025/07/bcb8bf23-78c9-45ab-b480-f7020d1a5f66.png.slim_.webp", alt: "Apple Pay" },
    { src: "https://db.store1920.com/wp-content/uploads/2025/07/b79a2dc3-b089-4cf8-a907-015a25ca12f2.png.slim_.webp", alt: "Tabby" },
    { src: "https://db.store1920.com/wp-content/uploads/2025/07/936bf9dc-9bb2-4935-9c5a-a70b800d4cf1.png.slim_.webp", alt: "Tamara" },
  ];

  return (
    <div className="payment-methods-wrapper">
      <h2 className="payment-heading">Payment Methods</h2>

      <div className="payment-options">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`payment-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => handleSelection(method.id)}
          >
            <div className="payment-card-content">
              <div className="payment-card-header">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === method.id}
                  onChange={() => handleSelection(method.id)}
                />

                {methodLogoMap[method.id] && (
                  <img src={methodLogoMap[method.id]} alt={method.title} className="payment-logo" />
                )}
                <span className="payment-title">{method.title}</span>
              </div>

              {/* Show only installment details for tabby and tamara when selected */}
              {isInstallment(method.id) && selectedMethod === method.id && (
                <div className="installment-row">
                  {[...Array(4)].map((_, i) => (
                    <div className="installment-box" key={i}>
                      <div>AED335.98</div>
                      <small>{i === 0 ? 'Today' : `In ${i} month${i > 1 ? 's' : ''}`}</small>
                    </div>
                  ))}
                </div>
              )}

              {/* Show card logos and input form only if stripe is selected */}
              {method.id === 'stripe' && selectedMethod === 'stripe' && (
                <>
                  <div className="card-logos-row">
                    {cardLogos.map((logo, idx) => (
                      <img key={idx} src={logo.src} alt={logo.alt} className="card-logo" />
                    ))}
                  </div>

                  <div className="card-details-form">
                    <input placeholder="Card number" required />
                    <div className="card-row">
                      <select>
                        <option>Month</option>
                      </select>
                      <select>
                        <option>Year</option>
                      </select>
                      <input placeholder="CVV" maxLength={4} />
                    </div>
                  </div>
                </>
              )}

              {/* Show COD fee info */}
              {method.id === 'cod' && (
                <p className="payment-desc">Non-refundable COD fee of AED16.53 applies.</p>
              )}

              {/* Hide other method details if not tabby/tamara or stripe or cod */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

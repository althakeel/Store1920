import React from 'react';
import '../../assets/styles/checkoutleft/paymentmethods.css';

import circleEmpty from '../../assets/images/tabby/full.webp';
import circleQuarter from '../../assets/images/tabby/quarter.webp';
import circleHalf from '../../assets/images/tabby/half.webp';
import circleFull from '../../assets/images/tabby/half-and-quarter.webp';
import aedIcon from '../../assets/images/Dirham 2.png';

import TabbyIcon from '../../assets/images/Footer icons/3.webp';
import TamaraIcon from '../../assets/images/Footer icons/6.webp';
import CashIcon from '../../assets/images/Footer icons/13.webp';
import CardIcon from '../../assets/images/tabby/creditcard.webp';

import AppleIcon from '../../assets/images/Footer icons/2.webp';
import VisaIcon from '../../assets/images/Footer icons/11.webp';
import MasterIcon from '../../assets/images/Footer icons/16.webp';
import GPayIcon from '../../assets/images/Footer icons/12.webp';
import PayPalIcon from '../../assets/images/Footer icons/20.webp';
import AmexIcon from '../../assets/images/Footer icons/11.webp';

const PaymentMethods = ({ selectedMethod, onMethodSelect, subtotal }) => {
  const paymentOptions = [
    { id: 'cod', title: 'Cash On Delivery', description: 'Pay with cash on delivery', img: CashIcon },
    { id: 'card', title: 'Credit/Debit Card', description: 'Pay securely with card', img: CardIcon },
    // { id: 'tabby', title: 'Tabby', description: 'Pay in 4 installments', img: TabbyIcon },
    // { id: 'tamara', title: 'Tamara', description: 'Pay later in 14 days', img: TamaraIcon },
  ];
    
  const renderExtraInfo = (method) => {
    const amount = Number(subtotal) || 0;
    const today = new Date();
    const formatDate = (date) =>
      date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    if (method === 'tabby') {
      const installment = (amount / 4).toFixed(2);
      const dates = [0, 30, 60, 90].map((d) => {
        const dt = new Date(today);
        dt.setDate(today.getDate() + d);
        return formatDate(dt);
      });

      const progressImages = [circleQuarter, circleHalf, circleFull, circleEmpty];

      return (
        <div className="pm-extra tabby-extra">
          <p style={{ color: 'grey' }}>Use Any cards</p>
          <p className="tabby-note">Pay in 4 easy installments without any extra fees</p>
          <div className="tabby-progress">
            {dates.map((date, idx) => (
              <div key={idx} className="tabby-step-wrapper">
                {idx !== 0 && <div className="tabby-line"></div>}
                <div className="tabby-step">
                  <img src={progressImages[idx]} alt={`Step ${idx + 1}`} className="tabby-circle" />
                  <div className="tabby-amount">
                    <img src={aedIcon} alt="AED" className="aed-icon" /> {installment}
                  </div>
                  <div className="tabby-date">{idx === 0 ? 'Today' : date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (method === 'tamara') {
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + 14);
      return (
        <div className="pm-extra tamara-extra">
          <p style={{ color: 'grey' }}>Use Any cards</p>
          <p>Pay later in 14 days:</p>
          <ul>
            <li>AED {amount.toFixed(2)} — {formatDate(dueDate)}</li>
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="pm-wrapper">
      <h3>Payment Method</h3>
      <div className="pm-cards">
        {paymentOptions.map((method) => (
          <div key={method.id} className="pm-card-wrapper">
            <div
              className={`pm-card ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => onMethodSelect(method.id, method.title)}
            >
              <img src={method.img} alt={method.title} className="pm-icon" />
              <div className="pm-text">
                <span className="pm-title">{method.title}</span>
                <span className="pm-desc">
                  {method.description}
                  {method.id === 'card' && (
                    <div className="card-icons">
                      <img src={AppleIcon} alt="Apple Pay" />
                      <img src={VisaIcon} alt="Visa" />
                      <img src={MasterIcon} alt="MasterCard" />
                      <img src={GPayIcon} alt="GPay" />
                      <img src={PayPalIcon} alt="PayPal" />
                      <img src={AmexIcon} alt="Amex" />
                    </div>
                  )}
                </span>
              </div>
              {selectedMethod === method.id && <span className="checkmark">&#10003;</span>}
            </div>
            {selectedMethod === method.id && (method.id === 'tabby' || method.id === 'tamara') && (
              <div className="pm-extra-container">{renderExtraInfo(method.id)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

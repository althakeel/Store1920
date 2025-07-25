import React from 'react';
import '../../assets/styles/checkout/TrustSection.css';
import { useNavigate } from 'react-router-dom';

const TrustSection = () => {
  const navigate = useNavigate();

  return (
    <div className="trust-section">
      {/* Tree Planting Program */}
      

      {/* Delivery Guarantee */}
      <div className="trust-box">
        <h3>🚚 Delivery Guarantee</h3>
        <ul>
          <li>✔ AED 20.00 Store Credit if your delivery is delayed by more than 7 days.</li>
          <li>✔ 100% Refund if your item arrives damaged or not as described.</li>
          <li>✔ No updates on tracking for 15+ days? Get a full refund — no questions asked.</li>
          <li>✔ No delivery in 30 days? You’ll get your money back in full.</li>
        </ul>
        <p>
          Your time matters. That’s why we’ve built a delivery policy that puts your peace of mind first.
        </p>
        <button onClick={() => navigate('/delivery-guarantee')}>Learn more ›</button>
      </div>

      {/* Payment Security */}
      <div className="trust-box">
        <h3>🔒 We protect your card</h3>
        <ul>
          <li>✔ Compliant with PCI DSS Level 1 — the highest payment security standard.</li>
          <li>✔ Industry-grade 256-bit SSL encryption on all payment pages.</li>
          <li>✔ Your card details are never stored or shared. Period.</li>
        </ul>
        <div className="card-logos">
          <img src="https://db.store1920.com/wp-content/uploads/2025/07/219cc18d-0462-47ae-bf84-128d38206065.png.slim_.webp" alt="SSL" />
          <img src="https://db.store1920.com/wp-content/uploads/2025/07/96e8ab9b-d0dc-40ac-ad88-5513379c5ab3.png.slim_.webp" alt="ID Check" />
          <img src="https://db.store1920.com/wp-content/uploads/2025/07/80d57653-6e89-4bd5-82c4-ac1e8e2489fd.png.slim_.webp" alt="SafeKey" />
          <img src="https://db.store1920.com/wp-content/uploads/2025/07/65e96f45-9ff5-435a-afbf-0785934809ef.png.slim-1.webp" alt="PCI" />
          <img src="https://db.store1920.com/wp-content/uploads/2025/07/058c1e09-2f89-4769-9fd9-a3cac76e13e5-1.webp" alt="APWG" />
          <img src="https://db.store1920.com/wp-content/uploads/2025/07/28a227c9-37e6-4a82-b23b-0ad7814feed1.png.slim_.webp" alt="PCI" />
          <img src="https://db.store1920.com/wp-content/uploads/2025/07/1f29a857-fe21-444e-8617-f57f5aa064f4.png.slim_.webp" alt="APWG" />
        </div>
        <button onClick={() => navigate('/security-info')}>Learn more ›</button>
      </div>

      {/* Privacy Commitment */}
      <div className="trust-box">
        <h3>🛡 Secure Privacy</h3>
        <p>
          We understand the importance of keeping your personal data safe. Your information is processed in compliance with 
          international privacy laws (GDPR & CCPA).
        </p>
        <ul>
          <li>✔ No third-party reselling of personal data.</li>
          <li>✔ Encrypted user profiles and cookie preferences.</li>
          <li>✔ Fully transparent privacy and cookie policies.</li>
        </ul>
        <button onClick={() => navigate('/privacy-policy')}>Learn more ›</button>
      </div>

      {/* Purchase Protection */}
      <div className="trust-box">
        <h3>✅ Purchase Protection</h3>
        <p>
          Enjoy full confidence with every order. If something doesn’t go right, we’re here to help with fast refunds and fair resolutions.
        </p>
        <ul>
          <li>✔ 24/7 customer support via live chat & email.</li>
          <li>✔ Escalation handling within 48 hours.</li>
          <li>✔ Full or partial refunds in case of fraud or disputes.</li>
        </ul>
        <button onClick={() => navigate('/purchaseprotection')}>Learn more ›</button>
      </div>
    </div>
  );
};

export default TrustSection;

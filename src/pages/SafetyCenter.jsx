import React from 'react';
import '../assets/styles/SafetyCenter.css'; 


const SafetyCenter = () => {
  return (
    <div className="safety-center-container">
      <div className="safety-header">
        <div className="header-inner">
          <h1>Safety Center</h1>
          <p className="subtitle">
            Store1920 is committed to creating a secure and trustworthy shopping experience. Learn how we protect you.
          </p>
        </div>
      </div>

      <div className="safety-content">
        <section className="safety-section">
          <h2>Protect your information</h2>
          <div className="safety-grid">
            <button>🔒 Protect your data</button>
            <button>🧑‍💼 Protect your account</button>
            <button>💳 Protect your payment</button>
          </div>
        </section>

        <section className="safety-section">
          <h2>Stay safe from scammers</h2>
          <div className="safety-grid">
            <button>🕵️ Recognize scams</button>
            <button>📧 Recognize scam emails</button>
            <button>💬 Recognize scam messages</button>
          </div>
        </section>

        <section className="safety-section">
          <h2>Report something suspicious</h2>
          <div className="safety-grid report-grid">
            <button>📞 Report suspicious calls, emails, or texts</button>
            <button>🌐 Report fake website or app</button>
            <button>🎁 Report promotions, fraud, or job scams</button>
          </div>
        </section>

        <section className="safety-section">
          <h2>Safety Partners</h2>
          <p>
            Store1920 supports secure payment methods and holds multiple security certifications.
          </p>
          <div className="partner-logos">
             <img src="https://db.store1920.com/wp-content/uploads/2025/07/058c1e09-2f89-4769-9fd9-a3cac76e13e5-1.webp" alt="Visa" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/6fad9cde-cc9c-4364-8583-74bb32612cea.webp" alt="MasterCard" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/3a626fff-bbf7-4a26-899a-92c42eef809a.png.slim_.webp" alt="AmEx" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/ec0c5d69-1717-4571-a193-9950ec73c8af.png.slim_.webp" alt="PayPal" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/da7f463a-916f-4d91-bcbb-047317a1c35e.png.slim_.webp" alt="Cash" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/c3e5eb19-1b60-4c2b-87e1-4528fb390cbf.png.slim_.webp" alt="Apple Pay" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/bcb8bf23-78c9-45ab-b480-f7020d1a5f66.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/b79a2dc3-b089-4cf8-a907-015a25ca12f2.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/936bf9dc-9bb2-4935-9c5a-a70b800d4cf1.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/ac293ffc-9957-4588-a4df-f3397b4a54e0.png.slim_.webp" alt="Apple Pay" />   
      </div>
        </section>
      </div>
    </div>
  );
};

export default SafetyCenter;

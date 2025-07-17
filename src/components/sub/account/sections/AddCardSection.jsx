// AddCardSection.jsx
import React, { useState } from 'react';
import BillingAddressModal from './BillingAddressModal';
import '../../../../assets/styles/myaccount/AddCardSection.css';

const AddCardSection = () => {
  const [isBillingModalOpen, setBillingModalOpen] = useState(false);

  return (
    <div className="add-card-container">
      <h2 className="card-title">Add a new card</h2>
      <form className="card-form">
        <label className="form-label">Card Number</label>
        <input className="form-input" type="text" placeholder="Card number" required />

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Expiration Date</label>
            <input className="form-input" type="text" placeholder="MM/YY" required />
          </div>
          <div className="form-group">
            <label className="form-label">CVV</label>
            <input className="form-input" type="text" placeholder="3-4 digits" required />
          </div>
        </div>

        <div className="billing-address-row">
          <label className="form-label">Billing Address</label>
          <div className="billing-link" onClick={() => setBillingModalOpen(true)}>Please input billing address &gt;</div>
        </div>

        <button type="submit" className="submit-card">Add your card</button>
      </form>
      <div className="accepted-cards">
              <img src="https://store1920.com/wp-content/uploads/2025/07/ec0c5d69-1717-4571-a193-9950ec73c8af.png.slim_.webp" alt="PayPal" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/da7f463a-916f-4d91-bcbb-047317a1c35e.png.slim_.webp" alt="Cash" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/c3e5eb19-1b60-4c2b-87e1-4528fb390cbf.png.slim_.webp" alt="Apple Pay" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/bcb8bf23-78c9-45ab-b480-f7020d1a5f66.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://store1920.com/wp-content/uploads/2025/07/b79a2dc3-b089-4cf8-a907-015a25ca12f2.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://store1920.com/wp-content/uploads/2025/07/936bf9dc-9bb2-4935-9c5a-a70b800d4cf1.png.slim_.webp" alt="Apple Pay" />   
</div>


      <div className="card-security-info">
        <h4 className="security-heading">Temu protects your card information</h4>
        <ul className="security-list">
          <li>Temu follows the Payment Card Industry Data Security Standard (PCI DSS) when handling card data</li>
          <li>Card information is secure and uncompromised</li>
          <li>All data is encrypted</li>
          <li>Temu never sells your card information</li>
        </ul>
      </div>

      <BillingAddressModal isOpen={isBillingModalOpen} onClose={() => setBillingModalOpen(false)} />
    </div>
  );
};

export default AddCardSection;
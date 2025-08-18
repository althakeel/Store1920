import React, { useEffect, useState } from 'react';
import '../../../assets/styles/CourierBanner.css';
// import emxLogo from '../../../assets/images/emx-logo.png';

const CourierBanner = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch('https://db.store1920.com/wp-json/store1920/v1/banner')
      .then((response) => response.json())
      .then((data) => {
        if (data.banner_url) {
          setBannerUrl(data.banner_url);
        }
      })
      .catch((error) => {
        console.error('Error fetching banner image:', error);
      });
  }, []);

  if (!bannerUrl) return null;

  return (
    <section className="courier-banner-section">
      <div className="banner-content" onClick={() => setShowPopup(true)}>
        <img className="banner-image" src={bannerUrl} alt="Courier Banner" />
        <div className="banner-overlay">
          <div className="banner-text">Fast & Reliable Courier Service</div>
          <div className="banner-arrow">➔</div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            {/* <img src={emxLogo} alt="EMX Logo" className="popup-logo" /> */}
            
            <h2 className="popup-title">Powered by EMX Logistics</h2>
            <p className="popup-message">
              Store1920 has partnered with <strong>EMX</strong> to ensure your orders are delivered 
              quickly, safely, and sustainably. Our goal is to provide a seamless shopping-to-delivery experience.
            </p>

            <ul className="popup-features">
              <li>🚚 <strong>Fast Delivery</strong> – Same-day and next-day delivery options available.</li>
              <li>🔒 <strong>Safe & Secure</strong> – Every package is handled with extra care.</li>
              <li>🌍 <strong>Eco-Friendly</strong> – Focus on sustainable logistics, including pick-up points and lockers.</li>
              <li>📦 <strong>Real-time Tracking</strong> – Get live updates on your shipment’s journey.</li>
              <li>🏬 <strong>Flexible Pick-up</strong> – Collect from lockers, hubs, or at your doorstep.</li>
            </ul>

            <p className="popup-note">
              With EMX, Store1920 ensures your online shopping experience doesn’t just stop at checkout— 
              it continues until your order is right in your hands.
            </p>

            <button className="popup-close-btn" onClick={() => setShowPopup(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CourierBanner;

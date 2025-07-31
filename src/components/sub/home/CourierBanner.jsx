import React, { useEffect, useState } from 'react';
import '../../../assets/styles/CourierBanner.css';
// import emxLogo from '../../../assets/images/emx-logo.png'; // Adjust the path

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
            <p className="popup-message">
              Temu is working with EMX to provide you with safe and fast delivery services while focusing on sustainable development, such as using pick up points and lockers.
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

import React, { useEffect, useState } from 'react';

const MobileCourierBanner = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!bannerUrl || !isMobile) return null;

  return (
    <section
      style={{
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: '0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '40px', // Ensures image and background are same height
          backgroundColor: '#3b73ee',
          borderRadius: '0',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => setShowPopup(true)}
      >
        <img
          src={bannerUrl}
          alt="Courier Banner"
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'cover',
            objectPosition: 'left center',
            flexShrink: 0,
            marginRight: '10px',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexGrow: 1,
            paddingRight: '12px',
            height: '100%',
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Montserrat, sans-serif',
              flexGrow: 1,
            }}
          >
            Fast & Reliable Courier
          </span>
          <span
            style={{
              fontSize: '18px',
              color: '#ffffff',
              marginLeft: '10px',
              userSelect: 'none',
            }}
          >
            ➔
          </span>
        </div>
      </div>

      {showPopup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          onClick={() => setShowPopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '10px',
              maxWidth: '90%',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.5,
                marginBottom: '20px',
                color: '#333',
              }}
            >
              Temu is working with EMX to provide you with safe and fast delivery services while focusing on sustainable development, such as using pick up points and lockers.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: '#ff5100',
                color: '#ffffff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MobileCourierBanner;

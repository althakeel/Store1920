import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/MainBanner.css';

const MainBanner = ({ banners = [], bannerKey }) => {
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Update mobile flag on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use the first banner from the static banners array
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    setCurrentBanner(banners[0]);
  }, [banners]);

 const handleClick = () => {
    navigate('/fest-sale'); // 👈 Always redirect here
  };


  if (!currentBanner) {
    return (
      <div className="banner-wrap loading" aria-live="polite" aria-busy="true">
        <div className="banner-skeleton" />
      </div>
    );
  }

  const bannerUrl = isMobile ? currentBanner.mobileUrl || currentBanner.url : currentBanner.url;

  return (
    <div
      className="banner-wrap"
      role="region"
      aria-label="Homepage Banner"
      style={{
        backgroundColor: currentBanner.bgColor || 'transparent', // 👈 single background color
        cursor: currentBanner.category ? 'pointer' : 'default',
      }}
     onClick={handleClick}
    >
      <div className="banner-inner">
        <img src={bannerUrl} alt="Main Banner" loading="lazy" />
      </div>
    </div>
  );
};

export default MainBanner;

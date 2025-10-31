import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/MainBanner.css';

const MainBanner = ({ banners = [], bannerKey }) => {
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  // Update mobile flag on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use the first banner from the static banners array
  useEffect(() => {
    if (!banners || banners.length === 0) {
      setIsLoading(true);
      return;
    }
    setCurrentBanner(banners[0]);
    setIsLoading(false);
    setImageLoaded(false); // Reset image loaded state for new banner
  }, [banners]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

 const handleClick = () => {
    navigate('/season-sale'); 
  };

  // Only show skeleton while banners are actually loading (not for image loading)
  if (isLoading) {
    return (
      <div className="banner-wrap loading" aria-live="polite" aria-busy="true">
        <div className="banner-skeleton">
          <div className="skeleton-content">
            <div className="skeleton-image"></div>
            <div className="skeleton-overlay">
              <div className="skeleton-text-line large"></div>
              <div className="skeleton-text-line medium"></div>
              <div className="skeleton-text-line small"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBanner) {
    return null;
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
        <img 
          src={bannerUrl} 
          alt="Main Banner" 
          loading="lazy"
          onLoad={handleImageLoad}
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </div>
    </div>
  );
};

export default MainBanner;

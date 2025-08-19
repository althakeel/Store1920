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

  // Pick a random banner once per site session (persistent across browser restarts)
  useEffect(() => {
    if (!banners || banners.length === 0 || !bannerKey) return;
  
    const localKey = `currentBanner_${bannerKey}`;
    const savedBanner = localStorage.getItem(localKey);
    let chosenBanner;
  
    if (savedBanner) {
      // Use saved banner only if it matches the current banners list
      const parsed = JSON.parse(savedBanner);
      const existsInBanners = banners.some(b => b.id === parsed.id);
      if (existsInBanners) {
        chosenBanner = parsed;
      } else {
        // saved banner is outdated, pick new
        const randomIndex = Math.floor(Math.random() * banners.length);
        chosenBanner = banners[randomIndex];
        localStorage.setItem(localKey, JSON.stringify(chosenBanner));
      }
    } else {
      // No saved banner, pick new
      const randomIndex = Math.floor(Math.random() * banners.length);
      chosenBanner = banners[randomIndex];
      localStorage.setItem(localKey, JSON.stringify(chosenBanner));
    }
  
    setCurrentBanner(chosenBanner);
  }, [banners, bannerKey]);
  
  

  const handleClick = (category) => {
    if (category) navigate(`/${category}`);
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
        background: `linear-gradient(to right, ${currentBanner.leftBg} 0%, ${currentBanner.leftBg} 50%, ${currentBanner.rightBg} 50%, ${currentBanner.rightBg} 100%)`,
        cursor: currentBanner.category ? 'pointer' : 'default',
      }}
      onClick={() => handleClick(currentBanner.category)}
    >
      <div className="banner-inner">
        <img src={bannerUrl} alt="Main Banner" loading="lazy" />
      </div>
    </div>
  );
};

export default MainBanner;

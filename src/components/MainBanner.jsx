import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import '../assets/styles/MainBanner.css';
import { useNavigate } from 'react-router-dom';

const API_BANNERS = 'https://db.store1920.com/wp-json/custom/v1/banners';

const MainBanner = () => {
  const [banners, setBanners] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch banners
  useEffect(() => {
    let isMounted = true;

    const cachedBanners = sessionStorage.getItem('banners');
    const cachedBannerIndex = sessionStorage.getItem('currentBannerIndex');

    if (cachedBanners && cachedBannerIndex !== null) {
      const bannersData = JSON.parse(cachedBanners);
      setBanners(bannersData);
      setCurrentBanner(bannersData[cachedBannerIndex]);
      return;
    }

    axios
      .get(API_BANNERS)
      .then((res) => {
        if (isMounted) {
          const bannersData = [
            {
              id: 'banner_1',
              url: isMobile ? res.data.banner_1_mobile : res.data.banner_1,
              category: isMobile ? res.data.banner_1_mobile_category : res.data.banner_1_category,
              leftBg: res.data.banner_1_left_bg || '#ffffff',
              rightBg: res.data.banner_1_right_bg || '#ffffff',
            },
            {
              id: 'banner_2',
              url: isMobile ? res.data.banner_2_mobile : res.data.banner_2,
              category: isMobile ? res.data.banner_2_mobile_category : res.data.banner_2_category,
              leftBg: res.data.banner_2_left_bg || '#ffffff',
              rightBg: res.data.banner_2_right_bg || '#ffffff',
            },
            {
              id: 'banner_3',
              url: isMobile ? res.data.banner_3_mobile : res.data.banner_3,
              category: isMobile ? res.data.banner_3_mobile_category : res.data.banner_3_category,
              leftBg: res.data.banner_3_left_bg || '#ffffff',
              rightBg: res.data.banner_3_right_bg || '#ffffff',
            },
          ].filter((b) => b.url);

          setBanners(bannersData);

          // Pick a random banner for this session
          const randomIndex = Math.floor(Math.random() * bannersData.length);
          setCurrentBanner(bannersData[randomIndex]);

          // Cache in sessionStorage
          sessionStorage.setItem('banners', JSON.stringify(bannersData));
          sessionStorage.setItem('currentBannerIndex', randomIndex);
        }
      })
      .catch(() => {
        if (isMounted) setBanners({});
      });

    return () => {
      isMounted = false;
    };
  }, [isMobile]);

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

  return (
    <div
      className="banner-wrap"
      role="region"
      aria-label="Homepage Banner"
      style={{
        background: `linear-gradient(to right, ${currentBanner.leftBg} 0%, ${currentBanner.leftBg} 50%, ${currentBanner.rightBg} 50%, ${currentBanner.rightBg} 100%)`,
      }}
      onClick={() => handleClick(currentBanner.category)}
    >
      <div className="banner-inner">
        <img
          src={currentBanner.url}
          alt="Main Banner"
          style={{ cursor: currentBanner.category ? 'pointer' : 'default' }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default MainBanner;

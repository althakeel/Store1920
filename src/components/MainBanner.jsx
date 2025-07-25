import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../assets/styles/MainBanner.css';

const API_BANNERS = 'https://db.store1920.com/wp-json/custom/v1/banners';

const MainBanner = () => {
  const [banners, setBanners] = useState(null);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const isMobile = window.innerWidth <= 768;

  // Fetch banner data
  useEffect(() => {
    axios
      .get(`${API_BANNERS}?_t=${Date.now()}`) // prevent caching
      .then(res => setBanners(res.data))
      .catch(() => setBanners({}));
  }, []);

  // Generate banner list based on device
  const bannerList = banners
    ? [
        {
          id: 'banner_1',
          url: isMobile ? banners.banner_1_mobile : banners.banner_1,
          category: isMobile ? banners.banner_1_mobile_category : banners.banner_1_category,
        },
        {
          id: 'banner_2',
          url: isMobile ? banners.banner_2_mobile : banners.banner_2,
          category: isMobile ? banners.banner_2_mobile_category : banners.banner_2_category,
        },
      ].filter(b => b.url)
    : [];

  // Set up auto-slide interval
  useEffect(() => {
    if (bannerList.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % bannerList.length);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [banners]);

  const handleClick = (slug) => {
    if (slug) {
      window.location.href = `/category/${slug}`;
    }
  };

  // Loading state
  if (banners === null) {
    return <div className="banner-wrap loading">Loading banners...</div>;
  }

  // No banner state
  if (bannerList.length === 0) {
    return <div className="banner-wrap error">No banners available.</div>;
  }

  return (
    <div className="banner-wrap" role="region" aria-label="Homepage Banners">
      {bannerList.map((banner, i) => (
        <img
          key={banner.id}
          src={banner.url}
          alt={`Banner ${i + 1}`}
          className={`banner-img ${i === index ? 'active' : ''}`}
          onClick={() => handleClick(banner.category)}
          style={{ cursor: banner.category ? 'pointer' : 'default' }}
          loading="lazy"
        />
      ))}

      {bannerList.length > 1 && (
        <div className="banner-dots" role="tablist" aria-label="Banner navigation">
          {bannerList.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              role="tab"
              aria-selected={i === index}
              tabIndex={i === index ? 0 : -1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainBanner;

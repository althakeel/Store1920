import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import '../assets/styles/MainBanner.css';

const API_BANNERS = 'https://db.store1920.com/wp-json/custom/v1/banners';

const MainBanner = () => {
  const [banners, setBanners] = useState(null);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch banners and cache in localStorage
  useEffect(() => {
    let isMounted = true;

    // Try localStorage first
    const cached = localStorage.getItem('banners');
    if (cached) {
      setBanners(JSON.parse(cached));
      return;
    }

    axios.get(API_BANNERS)
      .then(res => {
        if (isMounted) {
          setBanners(res.data);
          localStorage.setItem('banners', JSON.stringify(res.data));
        }
      })
      .catch(() => {
        if (isMounted) setBanners({});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize bannerList to avoid unnecessary recalculations
  const bannerList = useMemo(() => {
    if (!banners) return [];
    return [
      {
        id: 'banner_1',
        url: isMobile ? banners.banner_1_mobile : banners.banner_1,
        category: isMobile ? banners.banner_1_mobile_category : banners.banner_1_category,
        leftBg: banners.banner_1_left_bg || '#ffffff',
        rightBg: banners.banner_1_right_bg || '#ffffff',
      },
      {
        id: 'banner_2',
        url: isMobile ? banners.banner_2_mobile : banners.banner_2,
        category: isMobile ? banners.banner_2_mobile_category : banners.banner_2_category,
        leftBg: banners.banner_2_left_bg || '#ffffff',
        rightBg: banners.banner_2_right_bg || '#ffffff',
      },
    ].filter(b => b.url);
  }, [banners, isMobile]);

  // Auto-slide interval setup with bannerList memo dependency
  useEffect(() => {
    if (bannerList.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % bannerList.length);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [bannerList]);

  const handleClick = (slug) => {
    if (slug) {
      window.location.href = `/category/${slug}`;
    }
  };

  if (banners === null) {
    return (
      <div className="banner-wrap loading" aria-live="polite" aria-busy="true">
        <div className="banner-skeleton" />
      </div>
    );
  }

  if (bannerList.length === 0) {
    return <div className="banner-wrap error">No banners available.</div>;
  }

  return (
    <div className="banner-wrap" role="region" aria-label="Homepage Banners">
      {bannerList.map((banner, i) => (
        <div
          key={banner.id}
          className={`banner-container ${i === index ? 'active' : ''}`}
          style={{
            background: `linear-gradient(to right, ${banner.leftBg} 0%, ${banner.leftBg} 50%, ${banner.rightBg} 50%, ${banner.rightBg} 100%)`,
          }}
        >
          <div className="banner-inner">
            <img
              src={banner.url}
              alt={`Banner ${i + 1}`}
              onClick={() => handleClick(banner.category)}
              style={{ cursor: banner.category ? 'pointer' : 'default' }}
              loading="lazy"
            />
          </div>
        </div>
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

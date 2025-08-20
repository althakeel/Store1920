import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

// Components
import MainBanner from '../components/MainBanner';
import Whychoose from '../components/sub/home/whychoose';
import WhychooseMobile from '../components/sub/home/whychoosemobile';
import CategorySlider from '../components/sub/home/categoryslider';
import ProductCategory from '../components/sub/home/productcategory';
import LightningBanner from '../components/sub/home/LightningBanner';
import LightningBannerMobile from '../components/Mobile/mobileLightningdeals';
import CourierBanner from '../components/sub/home/CourierBanner';
import Shippingmobile from '../components/Mobile/shipping';
import MobileCategoriesSlider from '../components/Mobile/MobileCategorySlider';
import MobileCourierBanner from '../components/Mobile/MobileCourierBanner';
import GridCategories from '../components/sub/home/gridcategories';

const Home = ({ setNavbarColor }) => {
  const { currentTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [banners, setBanners] = useState([]);

  // --- 1. Update isMobile flag on resize ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 2. Update navbar color & fetch banners whenever theme changes ---
  useEffect(() => {
    if (!currentTheme) return;

    // Update navbar color
    setNavbarColor?.(currentTheme.navbarBg);

    const sessionKey = `banners_${currentTheme.bannerKey}`;
    
    // Check sessionStorage first
    const savedBanners = sessionStorage.getItem(sessionKey);
    if (savedBanners) {
      setBanners(JSON.parse(savedBanners));
      return;
    }

    // Fetch banners from API
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          `https://db.store1920.com/wp-json/custom/v1/banners?theme=${currentTheme.bannerKey}`
        );
        const data = res.data;

        const bannersArray = [
          {
            id: 1,
            url: data.banner_1,
            mobileUrl: data.banner_1_mobile,
            leftBg: data.banner_1_left_bg || '#fff',
            rightBg: data.banner_1_right_bg || '#fff',
            category: data.banner_1_category || null
          },
          // {
          //   id: 2,
          //   url: data.banner_2,
          //   mobileUrl: data.banner_2_mobile,
          //   leftBg: data.banner_2_left_bg || '#fff',
          //   rightBg: data.banner_2_right_bg || '#fff',
          //   category: data.banner_2_category || null
          // },
          // {
          //   id: 3,
          //   url: data.banner_3,
          //   mobileUrl: data.banner_3_mobile,
          //   leftBg: data.banner_3_left_bg || '#fff',
          //   rightBg: data.banner_3_right_bg || '#fff',
          //   category: data.banner_3_category || null
          // }
        ].filter(b => b.url);

        setBanners(bannersArray);
        sessionStorage.setItem(sessionKey, JSON.stringify(bannersArray));
      } catch (err) {
        console.error('Failed to fetch banners', err);

        // Fallback: load from sessionStorage if API fails
        const saved = sessionStorage.getItem(sessionKey);
        if (saved) setBanners(JSON.parse(saved));
      }
    };

    fetchBanners();
  }, [currentTheme, setNavbarColor]);

  // --- 3. Render UI ---
  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Main Banner */}
      <MainBanner banners={banners} bannerKey={currentTheme?.bannerKey} />
            {isMobile ? <Shippingmobile /> : <Whychoose />}
<GridCategories/>
      {/* Conditional mobile/desktop sections */}

      {isMobile ? <LightningBannerMobile /> : <LightningBanner />}
      {isMobile ? <MobileCategoriesSlider /> : <CategorySlider />}
      {isMobile ? <MobileCourierBanner /> : <CourierBanner />}

      {/* Product categories */}
      <ProductCategory />
    </div>
  );
};

export default Home;

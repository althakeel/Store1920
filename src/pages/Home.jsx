import React, { useState, useEffect } from 'react';
import MainBanner from '../components/MainBanner';
import Whychoose from '../components/sub/home/whychoose';
import WhychooseMobile from '../components/sub/home/whychoosemobile';
import CategorySlider from '../components/sub/home/categoryslider';
import ProductCategory from '../components/sub/home/productcategory';
import LightningBanner from '../components/sub/home/LightningBanner';
import LightningBannerMobile from '..//components/Mobile/mobileLightningdeals'; 
import CourierBanner from '../components/sub/home/CourierBanner';
import Shippingmobile from '../components/Mobile/shipping'
import MobileCategoriesSlider from '../components/Mobile/MobileCategorySlider';
import MobileCourierBanner from '../components/Mobile/MobileCourierBanner'

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <MainBanner />
      {isMobile ? <Shippingmobile /> : <Whychoose />}
      {isMobile ? <LightningBannerMobile /> : <LightningBanner />}
       {isMobile ? <MobileCategoriesSlider /> : <CategorySlider />}
      {/* <CategorySlider /> */}

          {isMobile ? <MobileCourierBanner /> : <CourierBanner />}
      {/* <CourierBanner /> */}
      <ProductCategory />
    </div>
  );
};

export default Home;

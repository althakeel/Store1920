import React from 'react';
import MainBanner from '../components/MainBanner';
import Whychoose from '../components/sub/home/whychoose';
import CategorySlider from '../components/sub/home/categoryslider';
import ProductCategory from '../components/sub/home/productcategory';
import LightningBanner from '../components/sub/home/LightningBanner';
import CourierBanner from '../components/sub/home/CourierBanner';

const Home = () => {
  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <MainBanner />
      <Whychoose />
      <LightningBanner/>
      <CategorySlider />
      <CourierBanner/>
      <ProductCategory />
    </div>
  );
};

export default Home;

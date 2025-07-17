import React from 'react';
import MainBanner from '../components/MainBanner';
import Whychoose from '../components/sub/home/whychoose';
import CategorySlider from '../components/sub/home/categoryslider';
import ProductCategory from '../components/sub/home/productcategory';
import LightningBanner from '../components/sub/home/LightningBanner';

const Home = () => {
  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <MainBanner />
      <Whychoose />
      <LightningBanner/>
      <CategorySlider />
      <ProductCategory />
    </div>
  );
};

export default Home;

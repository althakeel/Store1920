import React, { useEffect, useState } from 'react';

const CourierBanner = () => {
  const [bannerUrl, setBannerUrl] = useState('');

  useEffect(() => {
    fetch('https://db.store1920.com/wp-json/store1920/v1/banner')
      .then((response) => response.json())
      .then((data) => {
        if (data.banner_url) {
          setBannerUrl(data.banner_url);
        }
      })
      .catch((error) => {
        console.error('Error fetching banner image:', error);
      });
  }, []);

  if (!bannerUrl) return null;

  return (
    <section className="courier-banner-section" style={{ width: '100%', overflow: 'hidden' }}>
      <img
        src={bannerUrl}
        alt="Courier Banner"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </section>
  );
};

export default CourierBanner;

import React, { useState, useEffect } from 'react';

const SALE_BANNER_API = 'https://db.store1920.com/wp-json/custom/v1/sale-banner';

export default function SaleBanner() {
  const [bannerData, setBannerData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(SALE_BANNER_API)
      .then(async (res) => {
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Raw response text:', text);
        if (!text) throw new Error('Empty response from banner API');
        return JSON.parse(text);
      })
      .then(data => {
        console.log('Parsed data:', data);
        setBannerData(data);
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error loading banner: {error}</div>;
  if (!bannerData) return <div>Loading banner...</div>;

  return (
    <div
      style={{
        width: '100%',
        background: `linear-gradient(to right, ${bannerData.bg_left}, ${bannerData.bg_right})`,
        padding: '20px 0',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          backgroundColor: '#000',  // black background behind the image container
          padding: '0 15px',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={bannerData.desktop}
          alt="Sale Banner"
          style={{
            maxWidth: '100%',
            maxHeight: 350,
            height: 'auto',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>
    </div>
  );
}

import React from 'react';

const icons = {
  selection: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#464849ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16" />
      <path d="M9 4v16" />
    </svg>
  ),
  shipping: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#515253ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  commitment: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#575758ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4.5 8-10a8 8 0 0 0-16 0c0 5.5 8 10 8 10z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

const Store1920Info = () => {
  const container = {
    fontFamily: "'Montserrat', sans-serif",
    maxWidth: 1000,
    margin: '70px auto',
    padding: '0 20px',
    color: '#222',
  };

  const topSection = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
    marginBottom: 60,
    flexWrap: 'wrap',
  };

  const leftSide = {
    flex: '1 1 400px',
    minWidth: 300,
  };

  const heading = {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#ff7b00ff',
    marginBottom: 20,
    lineHeight: 1.1,
  };

  const introText = {
    fontSize: '1rem',
    color: '#444',
    lineHeight: 1.6,
  };

  const rightSide = {
    flex: '1 1 400px',
    minWidth: 300,
  };

  const imageStyle = {
    width: '100%',
    borderRadius: 16,
    maxWidth:'250px',
    // boxShadow: '0 10px 30px rgba(0,102,255,0.15)',
  };

  const features = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 30,
    flexWrap: 'wrap',
  };

  const featureCard = {
    flex: '1 1 280px',
    backgroundColor: '#f5f5f5ff',
    borderRadius: 14,
    padding: 30,
    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const featureTitle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ff5e00ff',
    marginTop: 20,
    marginBottom: 12,
  };

  const featureDesc = {
    fontSize: '1rem',
    color: '#444',
    lineHeight: 1.5,
  };

  return (
    <div style={container}>
      <section style={topSection}>
        <div style={leftSide}>
          <h1 style={heading}>Welcome to Store 1920 — Your Trusted Marketplace</h1>
          <p style={introText}>
            At Store 1920, we bring you closer to quality and craftsmanship by connecting you directly to authentic products from artisans and trusted brands worldwide.
            Shop with confidence, enjoy seamless delivery, and discover what makes us different.
          </p>
        </div>
        <div style={rightSide}>
          <img
            src="https://aimg.kwcdn.com/upload_aimg/personal/25472687-6a51-42f1-82ac-259b561c7ac5.png.slim.png?imageView2/2/w/1300/q/80/format/webp"
            alt="Store 1920 marketplace"
            style={imageStyle}
          />
        </div>
      </section>

      <section style={features}>
        <div style={featureCard}>
          {icons.selection}
          <h3 style={featureTitle}>Vast Selection</h3>
          <p style={featureDesc}>
            Explore an ever-growing catalog of premium products tailored to your tastes and needs.
          </p>
        </div>

        <div style={featureCard}>
          {icons.shipping}
          <h3 style={featureTitle}>Fast & Reliable Shipping</h3>
          <p style={featureDesc}>
            Our streamlined logistics ensure your orders arrive quickly and safely, every time.
          </p>
        </div>

        <div style={featureCard}>
          {icons.commitment}
          <h3 style={featureTitle}>Commitment to You</h3>
          <p style={featureDesc}>
            We put customers first, striving for excellence and integrity in all we do.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Store1920Info;

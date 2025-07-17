import React, { useEffect, useState } from 'react';

const offers = [
  {
    image: 'https://store1920.com/wp-content/uploads/2025/07/42-1-scaled.webp',
    text: 'Top picks at lower prices.',
    bg: '#49aec0',
  },
  {
    image: 'https://store1920.com/wp-content/uploads/2025/07/5-5-scaled.webp',
    text: 'Limited-time offer inside.',
    bg: '#ffc300',
  },
  {
    image: 'https://store1920.com/wp-content/uploads/2025/07/3-10-scaled.webp',
    text: 'Save big on last items now.',
    bg: '#49aec0',
  },
  {
    image: 'https://store1920.com/wp-content/uploads/2025/07/2-5-scaled.webp',
    text: 'Grab the best deal today.',
    bg: '#131723',
  },
  {
    image: 'https://store1920.com/wp-content/uploads/2025/07/1-4-scaled.webp',
    text: 'New drops for this season.',
    bg: '#cf0101',
  },
];

const isDarkColor = (hex) => {
  if (!hex) return false;
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
};

const OfferBox = () => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % offers.length);
        setAnimating(false);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const offer = offers[index];

  return (
    <div
      className="offer-box"
      style={{
        backgroundColor: offer.bg,
        color: isDarkColor(offer.bg) ? '#fff' : '#000',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        fontFamily: 'Arial, sans-serif',
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'background-color 0.6s ease, color 0.6s ease',
      }}
    >
      <img
        src={offer.image}
        alt={offer.text}
        className={animating ? 'animating' : ''}
        style={{
          width: 135,
          objectFit: 'cover',
          flexShrink: 0,
          borderRadius: 0,
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateX(-20px)' : 'translateX(0)',
        }}
      />
      <div
        className={`offer-text ${animating ? 'animating' : ''}`}
        style={{
          flexGrow: 1,
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateX(-20px)' : 'translateX(0)',
        }}
      >
        {offer.text}
      </div>
    </div>
  );
};

export default OfferBox;

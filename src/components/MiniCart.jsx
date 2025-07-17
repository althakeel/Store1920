import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../assets/styles/MiniCart.css';

const FREE_SHIPPING_THRESHOLD = 100;

const banners = [
  'https://store1920.com/wp-content/uploads/2025/07/Layer-1-copy-2.png',
  'https://store1920.com/wp-content/uploads/2025/07/Layer-1.png',
  'https://store1920.com/wp-content/uploads/2025/07/Layer-1-copy.png',
];

const MiniCart = () => {
  const { cartItems, updateQuantity, removeFromCart, setIsCartOpen } = useCart();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const navigate = useNavigate();

  // Rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-close if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) setIsCartOpen(false);
  }, [cartItems, setIsCartOpen]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const qualifiesFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Show stars when eligible
  useEffect(() => {
    if (qualifiesFreeShipping) {
      setShowStars(true);
      const timer = setTimeout(() => setShowStars(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [qualifiesFreeShipping]);

  if (cartItems.length === 0) return null;

  return (
    <div
      style={{
        width: 250,
        height: '100vh',
        position: 'fixed',
        top: 0,
        right: 0,
        background: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      {/* Top Section */}
      <div style={{ flexShrink: 0, padding: 12, background: '#fff', borderBottom: '1px solid #eee' }}>
        {/* Banner with Title */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <img
            src={banners[currentBannerIndex]}
            alt="Banner"
            style={{ width: '100%', borderRadius: 6 }}
          />
          <h2
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              fontSize: 18,
              color: '#fff',
              textShadow: '0 0 5px rgba(0,0,0,.6)',
              pointerEvents: 'none',
            }}
          >
            Cart
          </h2>
        </div>

        {/* Total Price */}
        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>
          Total: {totalPrice.toFixed(2)} AED
        </div>

        {/* Badge */}
        <div
          style={{
            background: '#4caf50',
            color: '#fff',
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 12,
            display: 'inline-block',
            marginBottom: 6,
          }}
        >
          Free shipping over 100 AED
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: 10,
            background: '#eee',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: qualifiesFreeShipping ? '#4caf50' : '#2196f3',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Message */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: qualifiesFreeShipping ? '#4caf50' : '#555',
            marginTop: 6,
          }}
        >
          {qualifiesFreeShipping
            ? 'You are eligible for free shipping!'
            : `Add ${(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(2)} AED more`}
        </div>

        {/* Buttons */}
        <button
          onClick={() => navigate('/checkout')}
          style={{
            marginTop: 10,
            width: '100%',
            padding: 8,
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Checkout
        </button>

        <button
          onClick={() => navigate('/cart')}
          style={{
            marginTop: 8,
            width: '100%',
            padding: 8,
            backgroundColor: '#f57c00',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Go to Cart
        </button>
      </div>

      {/* Stars Celebration Overlay with GIF */}
{showStars && (
  <div className="celebration-overlay">
    <img
      src="https://store1920.com/wp-content/uploads/2025/07/Pop-up-video.gif"
      alt="Celebration"
      className="celebration-gif"
    />
  </div>
)}
      {/* Product List */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px 12px' }}>
   {cartItems.map((item) => (
  <div className="mini-cart-product" key={item.id}>
    <img src={item.images?.[0]?.src || item.image || ''} alt="" />
    
    <div className="mini-cart-product-details">
      <div className="price">{item.price} AED</div>
      <select
        className="quantity-select"
        value={item.quantity}
        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
      >
        {Array.from(
          { length: Math.min(item.stock_quantity ?? 99, 99) },
          (_, i) => i + 1
        ).map((qty) => (
          <option key={qty} value={qty}>
            Qty: {qty}
          </option>
        ))}
      </select>
    </div>

    <button
      onClick={() => removeFromCart(item.id)}
      className="mini-cart-remove-btn"
      aria-label="Remove item"
    >
      ×
    </button>
  </div>
))}

      </div>
    </div>
  );
};

export default MiniCart;

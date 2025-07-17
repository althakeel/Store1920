import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/ButtonSection.css';
import { useCart } from '../../contexts/CartContext';

export default function ButtonSection({ product, selectedVariation, quantity, isClearance }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = () => {
    const variation = selectedVariation || product;
    const itemId = variation.id;
    const itemPrice = variation.price || product.price;

    const itemToAdd = {
      id: itemId,
      name: product.name,
      quantity,
      price: itemPrice,
      image: variation.image?.src || product.images?.[0]?.src || '',
      variation: selectedVariation?.attributes || [],
    };

    addToCart(itemToAdd);
    setAddedToCart(true);
    setIsCartOpen(true);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleGoToCheckout = () => {
    navigate('/checkout');
  };

  if (isClearance) {
    // Clearance Buy Now button with red background
    return (
      <div className="button-section">
        <button
          className="buy-now-btn"
          onClick={handleGoToCheckout}
          style={{
            backgroundColor: '#d32f2f', // red color
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 600,
          }}
        >
          Buy Now
        </button>
      </div>
    );
  }

  return (
    <div className="button-section" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {!addedToCart ? (
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      ) : (
        <>
          <button
            className="go-to-cart-btn"
            onClick={handleGoToCart}
            style={{
              backgroundColor: '#f57c00', // orange for Go to Cart
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            Go to Cart
          </button>

          <button
            className="go-to-checkout-btn"
            onClick={handleGoToCheckout}
            style={{
              backgroundColor: '#4caf50', // green for Go to Checkout
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            Go to Checkout
          </button>
        </>
      )}
    </div>
  );
}

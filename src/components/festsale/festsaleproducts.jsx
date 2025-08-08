import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/styles/festsale/FestSaleProducts.css';
import MiniCart from '../MiniCart';
import { useCart } from '../../contexts/CartContext';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_f44feff81d804619a052d7bbdded7153a1f45bdd';
const CONSUMER_SECRET = 'cs_92458ba6ab5458347082acc6681560911a9e993d';

const FestSaleProducts = () => {
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { addToCart, isCartOpen } = useCart();

  useEffect(() => {
    axios
      .get(`${API_BASE}/products`, {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET,
        },
        params: {
          per_page: 100,
          status: 'publish',
        },
      })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const truncateText = (text, maxLength = 25) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  const handleAddToCart = (product) => {
    addToCart(product, true); // Add to cart and open mini cart
  };

  return (
    <div
      className={`festsale-container ${isCartOpen ? 'with-minicart' : ''}`}
      role="main"
    >
      <h2 className="festsale-heading">🔥 Summer Festival Sale</h2>
      <div className="festsale-grid">
        {products.map((product, index) => (
          <div className="festsale-card" key={product.id}>
            <div
              className="festsale-image-wrapper"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => window.open(product.permalink, '_blank')}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') window.open(product.permalink, '_blank'); }}
              style={{ cursor: 'pointer' }}
              aria-label={`View details for ${product.name}`}
            >
              <img
                src={
                  hoveredIndex === index && product.images[1]
                    ? product.images[1].src
                    : product.images?.[0]?.src
                }
                alt={product.name}
                loading="lazy"
                className="festsale-image"
              />
              {product.sale_price && (
                <span className="festsale-badge">
                  {Math.round(
                    ((product.regular_price - product.sale_price) / product.regular_price) * 100
                  )}
                  % OFF
                </span>
              )}
            </div>
            <div className="festsale-info">
              <h3 className="festsale-name">{truncateText(product.name)}</h3>
              <div className="festsale-price">
                {product.sale_price ? (
                  <>
                    <span className="sale-price">AED {product.sale_price}</span>
                    <span className="regular-price">AED {product.regular_price}</span>
                  </>
                ) : (
                  <span className="sale-price">AED {product.regular_price}</span>
                )}
              </div>
              <button
                className="add-to-cart-btn1"
                onClick={() => handleAddToCart(product)}
                type="button"
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show MiniCart component */}
      {isCartOpen && <MiniCart />}
    </div>
  );
};

export default FestSaleProducts;

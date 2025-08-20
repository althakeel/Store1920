import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../assets/styles/Rated.css';
import { useCart } from '../contexts/CartContext';
import AddCarticon from '../assets/images/addtocart.png';
import AddedToCartIcon from '../assets/images/added-cart.png';
import IconAED from '../assets/images/Dirham 2.png';
import ProductCardReviews from './temp/productcardreviews';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v2';
const CONSUMER_KEY = 'ck_f44feff81d804619a052d7bbdded7153a1f45bdd';
const CONSUMER_SECRET = 'cs_92458ba6ab5458347082acc6681560911a9e993d';

const PRODUCTS_PER_PAGE = 20;
const TITLE_LIMIT = 35;

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const ProductsUnder20AED = () => {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Fetch products with price filter below 20 AED
  const fetchProducts = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        const url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PRODUCTS_PER_PAGE}&page=${pageNum}&max_price=20&orderby=date&order=desc`;
        const res = await fetch(url);
        const data = await res.json();

        if (pageNum === 1) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === PRODUCTS_PER_PAGE);
      } catch (e) {
        console.error('Failed to fetch products ', e);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Removed infinite scroll

  const truncate = (str) => (str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`);

  const onProductClick = (slug, id) => {
    let recent = JSON.parse(localStorage.getItem('recentProducts')) || [];
    recent = recent.filter((rid) => rid !== id);
    recent.unshift(id);
    localStorage.setItem('recentProducts', JSON.stringify(recent.slice(0, 5)));

    const url = `/product/${slug}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show toast for product added
  const showAddToCartToast = () => {
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000); // 3 seconds
  };

  // Handle "Load More" click
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <div className="pcus-wrapper12" style={{ display: 'flex' }}>
      <div className="pcus-categories-products1" style={{ width: '100%', transition: 'width 0.3s ease' }}>
        <h3 style={{ padding: '10px 20px 10px 0' }}>More Deals You’ll Love </h3>

        {loading && products.length === 0 ? (
          <div className="pcus-prd-grid12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pcus-prd-card pcus-skeleton" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ minHeight: '300px', textAlign: 'center', paddingTop: '40px', fontSize: '18px', color: '#666' }}>
            No products  found.
          </div>
        ) : (
          <div className="pcus-prd-grid12">
            {products.map((p) => (
              <div
                key={p.id}
                className="pcus-prd-card"
                onClick={() => onProductClick(p.slug, p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onProductClick(p.slug, p.id)}
                style={{ position: 'relative' }}
              >
                <div className="pcus-image-wrapper1">
                  <img
                    src={p.images?.[0]?.src || ''}
                    alt={decodeHTML(p.name)}
                    className="pcus-prd-image1 primary-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pcus-prd-info1">
                  <h3 className="pcus-prd-title1">{truncate(decodeHTML(p.name))}</h3>
                  <ProductCardReviews/>
                  <div className="pcus-prd-price-cart1">
                    <div className="pcus-prd-prices1">
                      <img
                        src={IconAED}
                        alt="AED currency icon"
                        style={{ width: 'auto', height: '13px', marginRight: '4px', verticalAlign: 'middle' }}
                      />
                      <span className="price1">{parseFloat(p.price).toFixed(2)}</span>
                    </div>
                    <button
                      className={`pcus-prd-add-cart-btn10 ${cartItems.some((item) => item.id === p.id) ? 'added-to-cart' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p, true);
                        showAddToCartToast();
                      }}
                      aria-label={`Add ${decodeHTML(p.name)} to cart`}
                    >
                      <img
                        src={cartItems.some((item) => item.id === p.id) ? AddedToCartIcon : AddCarticon}
                        alt={cartItems.some((item) => item.id === p.id) ? 'Added to cart' : 'Add to cart'}
                        className="pcus-prd-add-cart-icon-img"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

     {hasMore && (
  <div style={{ textAlign: 'center', margin: '20px 0' }}>
    <button 
      className="pcus-load-more-btn" 
      onClick={handleLoadMore} 
      disabled={loading}
      style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      {loading ? 'Loading...' : 'Load More'}
    </button>
  </div>
)}
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            zIndex: 9999,
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: showToast ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          Product added
        </div>
      )}
    </div>
  );
};

export default ProductsUnder20AED;

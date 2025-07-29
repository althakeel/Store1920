import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/ProductCategory.css';
import { useCart } from '../../../contexts/CartContext';
import MiniCart from '../../MiniCart';
import AddCarticon from '../../../assets/images/addtocart.png';
import AddedToCartIcon from '../../../assets/images/added-cart.png';
import Adsicon from '../../../assets/images/summer-saving-coloured.png';
import { throttle } from 'lodash';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_f44feff81d804619a052d7bbdded7153a1f45bdd';
const CONSUMER_SECRET = 'cs_92458ba6ab5458347082acc6681560911a9e993d';

const PAGE_SIZE = 10; // Categories pagination size
const PRODUCTS_PER_PAGE = 20; // Reduced from 50 for faster loading
const TITLE_LIMIT = 35;

const badgeLabelMap = {
  best_seller: 'Best Seller',
  recommended: 'Recommended',
};

const badgeColors = ['darkgreen', 'orange', 'red'];

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

// Memoized ReviewPills to avoid unnecessary re-renders
const ReviewPills = memo(({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`https://db.store1920.com/wp-json/custom-reviews/v1/product/${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => console.error('Review fetch error', err));
  }, [productId]);

  if (reviews.length === 0) return null;

  return (
    <div className="pcus-review-pill-wrapper">
      <div className="pcus-review-title">Customer Reviews</div>
      <div className="pcus-review-pill-scroll">
        {reviews.map((r, i) => (
          <div key={i} className="pcus-review-pill">
            <div className="pcus-review-pill-text">{r.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

const SkeletonCard = () => (
  <div className="pcus-prd-card pcus-skeleton">
    <div className="pcus-prd-image-skel" />
    <div className="pcus-prd-info-skel">
      <div className="pcus-prd-title-skel" />
      <div className="pcus-prd-review-skel" />
      <div className="pcus-prd-price-cart-skel" />
    </div>
  </div>
);

const ProductCategory = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [categories, setCategories] = useState([]);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);

  const [products, setProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const categoriesRef = useRef(null);
  const cartIconRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [badgeColorIndex, setBadgeColorIndex] = useState(0);

  // Rotate badge color every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeColorIndex((idx) => (idx + 1) % badgeColors.length);
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  // Fetch currency symbol
  useEffect(() => {
    async function fetchCurrencySymbol() {
      try {
        const res = await fetch(
          `${API_BASE}/settings/general?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
        );
        const data = await res.json();
        const currencyCode = data.find((item) => item.id === 'woocommerce_currency')?.value || 'USD';
        const map = { USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', INR: '₹' };
        setCurrencySymbol(map[currencyCode] || '$');
      } catch (e) {
        console.error(e);
      }
    }
    fetchCurrencySymbol();
  }, []);

  // Fetch categories with pagination
  const fetchCategories = useCallback(
    async (page = 1) => {
      setLoadingCategories(true);
      try {
        const res = await fetch(
          `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PAGE_SIZE}&page=${page}&orderby=name`
        );
        const data = await res.json();
        if (data.length < PAGE_SIZE) setHasMoreCategories(false);
        setCategories((prev) => [...prev, ...data]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCategories(false);
      }
    },
    []
  );

  // Fetch products with pagination and optional category filter
  const fetchProducts = useCallback(
    async (page = 1, categoryId = selectedCategoryId) => {
      setLoadingProducts(true);
      try {
        const url =
          `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PRODUCTS_PER_PAGE}&page=${page}&orderby=date&order=desc` +
          (categoryId !== 'all' ? `&category=${categoryId}` : '');
        const res = await fetch(url);
        const data = await res.json();

        if (page === 1) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }

        setHasMoreProducts(data.length >= PRODUCTS_PER_PAGE);
      } catch (e) {
        console.error(e);
        if (page === 1) setProducts([]);
        setHasMoreProducts(false);
      } finally {
        setLoadingProducts(false);
      }
    },
    [selectedCategoryId]
  );

  // Initial categories load
  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  // Load products on category change
  useEffect(() => {
    setProductsPage(1);
    setHasMoreProducts(true);
    fetchProducts(1, selectedCategoryId);
  }, [selectedCategoryId, fetchProducts]);

  // Load more products handler
  const loadMoreProducts = () => {
    if (loadingProducts || !hasMoreProducts) return;
    const nextPage = productsPage + 1;
    setProductsPage(nextPage);
    fetchProducts(nextPage, selectedCategoryId);
  };

  // Throttled arrow visibility update on scroll
  const updateArrowVisibility = useCallback(() => {
    const el = categoriesRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollWidth - el.scrollLeft > el.clientWidth + 10);
  }, []);

  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;

    const throttledUpdate = throttle(updateArrowVisibility, 100);
    el.addEventListener('scroll', throttledUpdate);
    updateArrowVisibility();

    return () => el.removeEventListener('scroll', throttledUpdate);
  }, [categories, updateArrowVisibility]);

  // Drag scroll support
  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;

    let isDown = false,
      startX,
      scrollLeft;

    const start = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1;
      el.scrollLeft = scrollLeft - walk;
    };
    const stop = () => {
      isDown = false;
    };

    el.addEventListener('mousedown', start);
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', stop);
    el.addEventListener('mouseup', stop);

    return () => {
      el.removeEventListener('mousedown', start);
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', stop);
      el.removeEventListener('mouseup', stop);
    };
  }, []);

  const truncate = (str) => (str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`);

  const renderStars = (ratingStr) => {
    const rating = parseFloat(ratingStr);
    return (
      <span className="pcus-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'pcus-star filled' : 'pcus-star'}>
            ★
          </span>
        ))}
      </span>
    );
  };

  const flyToCart = (e, imgSrc) => {
    if (!cartIconRef.current || !imgSrc) return;

    const cartRect = cartIconRef.current.getBoundingClientRect();
    const startRect = e.currentTarget.getBoundingClientRect();

    const clone = document.createElement('img');
    clone.src = imgSrc;
    clone.style.position = 'fixed';
    clone.style.zIndex = 9999;
    clone.style.width = '60px';
    clone.style.height = '60px';
    clone.style.top = `${startRect.top}px`;
    clone.style.left = `${startRect.left}px`;
    clone.style.transition = 'all 0.7s ease-in-out';
    clone.style.borderRadius = '50%';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.top = `${cartRect.top}px`;
      clone.style.left = `${cartRect.left}px`;
      clone.style.opacity = '0';
      clone.style.transform = 'scale(0.2)';
    });

    setTimeout(() => clone.remove(), 800);
  };

  const scrollCats = (dir) => {
    const el = categoriesRef.current;
    if (el) el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  // Memoized product click handler
  const onProductClick = useCallback((slug) => {
    window.open(`/product/${slug}`, '_blank');
  }, []);

  return (
    <div className="pcus-wrapper" style={{ display: 'flex' }}>
      <div className="pcus-categories-products" style={{ width: '100%', transition: 'width 0.3s ease' }}>
        {/* Title + Subtitle */}
        <div className="pcus-title-section">
          <h2 className="pcus-main-title">
            <img src={Adsicon} style={{ maxWidth: '18px' }} alt="Ads icon" /> SUMMER SAVINGS{' '}
            <img src={Adsicon} style={{ maxWidth: '18px' }} alt="Ads icon" />
          </h2>
          <p className="pcus-sub-title">BROWSE WHAT EXCITES YOU</p>
        </div>

        <div className="pcus-categories-wrapper">
          {canScrollLeft && (
            <button className="pcus-arrow-btn" onClick={() => scrollCats('left')} aria-label="Prev">
              ‹
            </button>
          )}
          <div className="pcus-categories-scroll" ref={categoriesRef}>
            <button
              className={`pcus-category-btn ${selectedCategoryId === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategoryId('all')}
            >
              Recommended
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`pcus-category-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId(cat.id)}
                title={decodeHTML(cat.name)}
              >
                {decodeHTML(cat.name)}
              </button>
            ))}
            {hasMoreCategories && (
              <button
                className="pcus-category-btn load-more"
                disabled={loadingCategories}
                onClick={() => {
                  if (!loadingCategories) {
                    fetchCategories(categoriesPage + 1);
                    setCategoriesPage((p) => p + 1);
                  }
                }}
              >
                {loadingCategories ? 'Loading…' : 'Load More'}
              </button>
            )}
          </div>
          {canScrollRight && (
            <button className="pcus-arrow-btn" onClick={() => scrollCats('right')} aria-label="Next">
              ›
            </button>
          )}
        </div>

        {loadingProducts && products.length === 0 ? (
          <div className="pcus-prd-grid">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : products.length === 0 ? (
          <div className="pcus-no-products">No products found.</div>
        ) : (
          <>
            <div className="pcus-prd-grid">
              {products.map((p) => {
                const onSale = p.price !== p.regular_price;
                const rawBadges = p.best_seller_recommended_badges || [];
                const badges = Array.isArray(rawBadges) ? rawBadges : [];
                const soldCount = p.meta_data?.find((m) => m.key === '_sold_count')?.value ?? 0;

                return (
                  <div
                    key={p.id}
                    className="pcus-prd-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(p.slug);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onProductClick(p.slug)}
                  >
                    <div className="pcus-image-wrapper">
                      <img
                        src={p.images?.[0]?.src || ''}
                        alt={decodeHTML(p.name)}
                        className="pcus-prd-image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="pcus-prd-info">
                      <h3 className="pcus-prd-title">
                        {badges.length > 0 && (
                          <div className={`pcus-badges-inline pcus-badges-color-${badgeColors[badgeColorIndex]}`}>
                            {badges.map((badge, i) => (
                              <span key={i} className={`pcus-badge pcus-badge-${badge}`}>
                                {badgeLabelMap[badge]}
                              </span>
                            ))}
                          </div>
                        )}
                        &nbsp;{truncate(decodeHTML(p.name))}
                      </h3>

                      {/* RATING + SOLD aligned */}
                      <div
                        className="pcus-prd-review"
                        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                      >
                        {renderStars(p.average_rating)}
                        <div className="pcus-sold-badge" style={{ position: 'static' }}>
                          Sold: {soldCount}
                        </div>
                      </div>

                      <ReviewPills productId={p.id} />

                      <div className="pcus-prd-price-cart">
                        <div className="pcus-prd-prices">
                          <span className={`pcus-prd-sale-price ${onSale ? 'on-sale' : ''}`}>
                            {currencySymbol}
                            {p.price}
                          </span>
                          {onSale && (
                            <span className="pcus-prd-regular-price">
                              {currencySymbol}
                              {p.regular_price}
                            </span>
                          )}
                          {onSale && p.regular_price && p.price && (
                            <span className="pcus-prd-discount-box">
                              -
                              {Math.round(((p.regular_price - p.price) / p.regular_price) * 100)}% OFF
                            </span>
                          )}
                        </div>

                        <button
                          className={`pcus-prd-add-cart-btn ${
                            cartItems.some((item) => item.id === p.id) ? 'added-to-cart' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            flyToCart(e, p.images?.[0]?.src); // Animate image fly to cart
                            addToCart(p, true);
                          }}
                          aria-label={`Add ${decodeHTML(p.name)} to cart`}
                        >
                          <img
                            src={cartItems.some((item) => item.id === p.id) ? AddedToCartIcon : AddCarticon}
                            alt={cartItems.some((item) => item.id === p.id) ? 'Added to cart' : 'Add to cart'}
                            className="pcus-prd-add-cart-icon-img"
                          />
                        </button>

                        <div
                          id="cart-icon"
                          ref={cartIconRef}
                          style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMoreProducts && (
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button className="pcus-load-more-btn" onClick={loadMoreProducts} disabled={loadingProducts}>
                  {loadingProducts ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <MiniCart />
    </div>
  );
};

export default ProductCategory;

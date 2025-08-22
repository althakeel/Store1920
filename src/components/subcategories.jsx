import React, { useState, useEffect, useRef, useCallback } from 'react';
import '..//assets/styles/subCategorySlider.css';
import { useCart } from '../contexts/CartContext';
import MiniCart from '../components/MiniCart';
import { useNavigate } from 'react-router-dom';
import Recomendedicon from '../assets/images/grid.png';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_be7e3163c85f7be7ca616ab4d660d65117ae5ac5';
const CONSUMER_SECRET = 'cs_df731e48bf402020856ff21400c53503d545ac35';
const PAGE_SIZE = 10;
const PRODUCTS_PER_PAGE = 10;
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

const ReviewPills = ({ productId }) => {
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
};

const ProductCategory = () => {
  const navigate = useNavigate();
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { addToCart } = useCart();
  const [badgeColorIndex, setBadgeColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeColorIndex((idx) => (idx + 1) % badgeColors.length);
    }, 600000);
    return () => clearInterval(interval);
  }, []);

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

const fetchCategories = useCallback(async (page = 1) => {
  setLoadingCategories(true);
  try {
    const res = await fetch(
      `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PAGE_SIZE}&page=${page}&hide_empty=false&orderby=name&parent=0`
    );
    const data = await res.json();

    if (data.length < PAGE_SIZE) setHasMoreCategories(false);

    setCategories((prev) => {
      const existingIds = new Set(prev.map((cat) => cat.id));
      const newUnique = data.filter((cat) => !existingIds.has(cat.id));
      return [...prev, ...newUnique];
    });
  } catch (e) {
    console.error(e);
  } finally {
    setLoadingCategories(false);
  }
}, []);



const fetchProducts = useCallback(async (page = 1, categoryId = selectedCategoryId) => {
  setLoadingProducts(true);
  try {
    // Append tag=lightingdeals to filter products by tag
    const tagFilter = 'lightingdeals';
    
    const url =
      `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}` +
      `&per_page=${PRODUCTS_PER_PAGE}&page=${page}&orderby=date&order=desc&tag=${tagFilter}` +
      (categoryId !== 'all' ? `&category=${categoryId}` : '');

    const res = await fetch(url);
    let data = await res.json();

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
}, [selectedCategoryId]);


  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  useEffect(() => {
    setProductsPage(1);
    setHasMoreProducts(true);
    fetchProducts(1, selectedCategoryId);
  }, [selectedCategoryId, fetchProducts]);

  const loadMoreProducts = () => {
    if (loadingProducts || !hasMoreProducts) return;
    const nextPage = productsPage + 1;
    setProductsPage(nextPage);
    fetchProducts(nextPage, selectedCategoryId);
  };

  const updateArrowVisibility = () => {
    const el = categoriesRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollWidth - el.scrollLeft > el.clientWidth + 10);
  };

  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrowVisibility);
    updateArrowVisibility();
    return () => el.removeEventListener('scroll', updateArrowVisibility);
  }, [categories]);

  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;
    let isDown = false, startX, scrollLeft;
    const start = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX);
      el.scrollLeft = scrollLeft - walk;
    };
    const stop = () => { isDown = false; };
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

  const scrollCats = (dir) => {
    const el = categoriesRef.current;
    if (el) el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="pcus-wrapper1" style={{ display: 'flex' }}>
      <div className="pcus-categories-products1" style={{ width: '100%', transition: 'width 0.3s ease' }}>
        <div className="pcus-title-section1">
          {/* <h2 className="pcus-main-title1">🏷️ SUMMER SAVINGS 🏷️</h2>
          <p className="pcus-sub-title1">BROWSE WHAT EXCITES YOU</p> */}
        </div>

        <div className="pcus-categories-wrapper">
          {canScrollLeft && <button className="pcus-arrow-btn1 left" onClick={() => scrollCats('left')} aria-label="Prev">‹</button>}
          <div className="pcus-categories-scroll" ref={categoriesRef}>
            <button className={`pcus-category-btn1 ${selectedCategoryId === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategoryId('all')}>
              <div className="recomended">
                <img src={Recomendedicon} className="pcus-category-img" alt="Recommended Icon" />
                <div className="recomended-text">Recommended</div>
              </div>
            </button>
            {categories.map((cat) => (
              <button key={cat.id} className={`pcus-category-btn1 ${selectedCategoryId === cat.id ? 'active' : ''}`} onClick={() => setSelectedCategoryId(cat.id)}>
                {cat.image?.src && <img src={cat.image.src} alt={cat.name} className="pcus-category-img" loading="lazy" decoding="async" draggable={false} onDragStart={(e) => e.preventDefault()} />}
                <div className="pcus-category-name">{decodeHTML(cat.name)}</div>
              </button>
            ))}
            {hasMoreCategories && <button className="pcus-category-btn1 load-more" disabled={loadingCategories} onClick={() => { if (!loadingCategories) { fetchCategories(categoriesPage + 1); setCategoriesPage((p) => p + 1); } }}>{loadingCategories ? 'Loading…' : 'Load More'}</button>}
          </div>
          {canScrollRight && <button className="pcus-arrow-btn1 right" onClick={() => scrollCats('right')} aria-label="Next">›</button>}
        </div>

        <div className="pcus-prd-grid">
          {products.map((p) => {
            const onSale = p.price !== p.regular_price;
            const rawBadges = p.best_seller_recommended_badges || [];
            const badges = Array.isArray(rawBadges) ? rawBadges : [];
            const soldCount = p.meta_data?.find((m) => m.key === '_sold_count')?.value ?? 0;
            return (
              <div key={p.id} className="pcus-prd-card" onClick={() => navigate(`/product/${p.slug}`)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${p.slug}`)}>
                <div className="pcus-image-wrapper">
                  <img src={p.images?.[0]?.src || ''} alt={decodeHTML(p.name)} className="pcus-prd-image" loading="lazy" decoding="async" />
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
  <span className="pcus-title-text">{truncate(decodeHTML(p.name))}</span>
</h3>

                  <div className="pcus-prd-review" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {renderStars(p.average_rating)}
                    <div className="pcus-sold-badge" style={{ position: 'static' }}>Sold: {soldCount}</div>
                  </div>
                  <ReviewPills productId={p.id} />
                  <div className="pcus-prd-price-cart">
                    <div className="pcus-prd-prices">
                      <span className={`pcus-prd-sale-price ${onSale ? 'on-sale' : ''}`}>{currencySymbol}{p.price}</span>
                      {onSale && <span className="pcus-prd-regular-price">{currencySymbol}{p.regular_price}</span>}
                      {onSale && p.regular_price && p.price && <span className="pcus-prd-discount-box">-{Math.round(((p.regular_price - p.price) / p.regular_price) * 100)}% OFF</span>}
                    </div>
                    <button className="pcus-prd-add-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }} aria-label={`Add ${decodeHTML(p.name)} to cart`}>
                      <img src="https://db.store1920.com/wp-content/uploads/2025/07/ADD-TO-CART-1.png" alt="Add to cart" className="pcus-prd-add-cart-icon-img" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {loadingProducts && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
{!loadingProducts && products.length === 0 && (
  <div className="pcus-no-products-wrapper">
    <div className="pcus-no-products">
      No products found in this category.
    </div>
  </div>
)}

        </div>

        {hasMoreProducts && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <button className="pcus-load-more-btn" onClick={loadMoreProducts} disabled={loadingProducts}>
              {loadingProducts ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </div>
      <MiniCart />
    </div>
  );
};

export default ProductCategory;

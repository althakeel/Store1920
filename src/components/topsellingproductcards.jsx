
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/topselling.css';
import { useCart } from '../contexts/CartContext';
import MiniCart from '../components/MiniCart';
import AddCarticon from '../assets/images/addtocart.png';
import AddedToCartIcon from '../assets/images/added-cart.png';
import Adsicon from '../assets/images/summer-saving-coloured.png';
import IconAED from '../assets/images/Dirham 2.png';
import { throttle } from 'lodash';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v2';
const CONSUMER_KEY = 'ck_f44feff81d804619a052d7bbdded7153a1f45bdd';
const CONSUMER_SECRET = 'cs_92458ba6ab5458347082acc6681560911a9e993d';

const PAGE_SIZE = 10;
const PRODUCTS_PER_PAGE = 20;
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

const handleProductClick = (productId) => {
  let recent = JSON.parse(localStorage.getItem('recentProducts')) || [];

  // Remove if it already exists
  recent = recent.filter(id => id !== productId);

  // Add to front
  recent.unshift(productId);

  // Save only latest 5
  localStorage.setItem('recentProducts', JSON.stringify(recent.slice(0, 5)));
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

const ProductCategory = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [categories, setCategories] = useState([]);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);

  const [products, setProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [variationPrices, setVariationPrices] = useState({});

  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const categoriesRef = useRef(null);
  const cartIconRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [badgeColorIndex, setBadgeColorIndex] = useState(0);

  const [productVariations, setProductVariations] = useState({});
  const [sortedProducts, setSortedProducts] = useState([]);

   const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const observerRef = React.useRef(null);

const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
const [festSaleTagId, setfestSaleTagId] = useState(null);

const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');
const [sortOption, setSortOption] = useState('date_desc'); // default sort

const [showPriceFilterOnly, setShowPriceFilterOnly] = useState(false);

const dropdownRef = useRef(null);
  const BEST_RATED_TAG_SLUG = 'bestrated';



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

useEffect(() => {
  const recent = JSON.parse(localStorage.getItem('recentProducts')) || [];

  if (recent.length === 0) {
    setSortedProducts(products);
    return;
  }

  const recentSet = new Set(recent);

  const recentProducts = recent
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const remainingProducts = products.filter(p => !recentSet.has(p.id));

  setSortedProducts([...recentProducts, ...remainingProducts]);
}, [products]);


  useEffect(() => {
    products.forEach((p) => {
      if (p.type === 'variable' && !productVariations[p.id]) {
        fetchAllVariations(p.id);
      }
    });
  }, [products]);

  const fetchAllVariations = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE}/products/${productId}/variations?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setProductVariations((prev) => ({
          ...prev,
          [productId]: data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching variations for product ${productId}`, error);
    }
  };

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

  const getTagIdFromSlug = async (slug) => {
  const res = await fetch(
    `${API_BASE}/products/tags?slug=${slug}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
  );
  const tags = await res.json();
  return tags[0]?.id || null;
};


useEffect(() => {
  getTagIdFromSlug(BEST_RATED_TAG_SLUG).then((id) => setfestSaleTagId(id));
}, []);

const fetchProducts = useCallback(
  async (page = 1, categoryId = selectedCategoryId) => {
    if (!festSaleTagId) return; // wait until tagId is loaded
    setLoadingProducts(true);
    try {
      let url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PRODUCTS_PER_PAGE}&page=${page}&tag=${festSaleTagId}`;

      if (categoryId !== 'all') url += `&category=${categoryId}`;

      // Add price filter params
      if (minPrice) url += `&min_price=${minPrice}`;
      if (maxPrice) url += `&max_price=${maxPrice}`;

      // Add sorting param based on sortOption state
      switch (sortOption) {
        case 'price_asc':
          url += '&orderby=price&order=asc';
          break;
        case 'price_desc':
          url += '&orderby=price&order=desc';
          break;
        case 'popularity':
          url += '&orderby=popularity&order=desc';
          break;
        default:
          url += '&orderby=date&order=desc';
      }

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
    } finally {
      setLoadingProducts(false);
    }
  },
  [selectedCategoryId, festSaleTagId, minPrice, maxPrice, sortOption]
);


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

  useEffect(() => {
    products.forEach((p) => {
      if (p.type === 'variable') {
        fetchFirstVariation(p.id);
      }
    });
  }, [products]);

  const fetchFirstVariation = async (productId) => {
  try {
    const res = await fetch(
      `${API_BASE}/products/${productId}/variations?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=1`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const variation = data[0];
      setVariationPrices((prev) => ({
        ...prev,
        [productId]: {
          price: variation.price,
          regular_price: variation.regular_price,
          sale_price: variation.sale_price,
        },
      }));
    }
  } catch (error) {
    console.error(`Error fetching first variation for product ${productId}`, error);
  }
};


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

  useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowCategoriesDropdown(false);
    }
  }

  if (showCategoriesDropdown) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showCategoriesDropdown]);

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
const onProductClick = useCallback((slug, id) => {
  // Save in localStorage as most recently viewed
  let recent = JSON.parse(localStorage.getItem('recentProducts')) || [];

  recent = recent.filter(rid => rid !== id); 
  recent.unshift(id); // add to top
  localStorage.setItem('recentProducts', JSON.stringify(recent.slice(0, 5))); // keep top 5

  const url = `/product/${slug}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);


  useEffect(() => {
    const handleScroll = () => {
      if (loadingProducts || !hasMoreProducts) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingProducts, hasMoreProducts, productsPage]);

  return (
    <div className="pcus-wrapper1" style={{ display: 'flex' }}>
      <div className="pcus-categories-products1" style={{ width: '100%', transition: 'width 0.3s ease' }}>
<div
  className="pcus-title-section"

>

</div>

       <div className="pcus2-filter-bar">
  <div className="pcus2-dropdown">
    <button
      className="pcus2-dropdown-btn"
      onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
      aria-haspopup="listbox"
      aria-expanded={showCategoriesDropdown}
    >
      Categories
      <span className="pcus2-dropdown-arrow">{showCategoriesDropdown ? '▲' : '▼'}</span>
    </button>
    {showCategoriesDropdown && (
      <ul
        className="pcus2-dropdown-list"
        role="listbox"
        tabIndex={-1}
       
      >
        <li
          key="all"
          className={`pcus2-dropdown-item ${selectedCategoryId === 'all' ? 'active' : ''}`}
          role="option"
          aria-selected={selectedCategoryId === 'all'}
          onClick={() => {
            setSelectedCategoryId('all');
            setShowCategoriesDropdown(false);
          }}
        >
          Recommended
        </li>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`pcus2-dropdown-item ${selectedCategoryId === cat.id ? 'active' : ''}`}
            role="option"
            aria-selected={selectedCategoryId === cat.id}
            onClick={() => {
              setSelectedCategoryId(cat.id);
              setShowCategoriesDropdown(false);
            }}
            title={decodeHTML(cat.name)}
          >
            {decodeHTML(cat.name)}
          </li>
        ))}
      </ul>
    )}
  </div>

    {/* Sort Buttons */}
    <div className="pcus2-sort-options" style={{ display: 'flex', gap: '10px' }}>
      <button
        className={`pcus2-filter-btn ${sortOption === 'price_asc' ? 'active' : ''}`}
        onClick={() => {
          setSortOption('price_asc');
          setProductsPage(1);
        }}
        style={{ padding: '6px 14px' }}
      >
        Price: Low to High
      </button>
      <button
        className={`pcus2-filter-btn ${sortOption === 'price_desc' ? 'active' : ''}`}
        onClick={() => {
          setSortOption('price_desc');
          setProductsPage(1);
        }}
        style={{ padding: '6px 14px' }}
      >
        Price: High to Low
      </button>
    </div>
  </div>



       {loadingProducts && products.length === 0 ? (
  <div className="pcus-prd-grid12">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
) : products.length === 0 ? (
  <div className="pcus-no-products" style={{ minHeight: '300px', textAlign: 'center', paddingTop: '40px', fontSize: '18px', color: '#666' }}>
    No products found.
  </div>
) : (
  <>
            <div className="pcus-prd-grid12">
              {sortedProducts.map((p) => {
                const isVariable = p.type === 'variable';
                const variationPriceInfo = variationPrices[p.id] || { price: null, regular_price: null, sale_price: null };
                const variantsCount = p.variations ? p.variations.length : 0;
                const displayRegularPrice = isVariable
                  ? variationPriceInfo.regular_price
                  : p.regular_price || p.price;

                const displaySalePrice = isVariable
                  ? variationPriceInfo.sale_price
                  : p.sale_price || null;

                const displayPrice = isVariable
                  ? variationPriceInfo.price
                  : p.price || p.regular_price || 0;

                const onSale = displaySalePrice && displaySalePrice !== displayRegularPrice;

                const badges = []; // Placeholder, add your badge logic here if any
                const soldCount = 0; // Placeholder, add your sold count logic here if any

                return (
                  <div
                    key={p.id}
                    className="pcus-prd-card"
                   onClick={(e) => {
  e.stopPropagation();
  onProductClick(p.slug, p.id); // Pass product ID
}}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onProductClick(p.slug)}
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
  {p.images?.[1] && (
    <img
      src={p.images[1].src}
      alt={`${decodeHTML(p.name)} - second`}
      className="pcus-prd-image1 secondary-img"
      loading="lazy"
      decoding="async"
    />
  )}
 {p.stock_status && (
  <>
    {p.stock_status === 'outofstock' ? (
      <div className="pcus-stock-overlay12 out-of-stock">Out of Stock</div>
    ) : typeof p.stock_quantity === 'number' && p.stock_quantity < 50 ? (
      <div className="pcus-stock-overlay12 low-stock">
        Only {p.stock_quantity} left in stock
      </div>
    ) : null}
  </>
)}
</div>
                    <div className="pcus-prd-info1">
                      <h3 className="pcus-prd-title1">
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

                      <div className="pcus-prd-review" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {renderStars(p.average_rating)}
                        <div className="pcus-sold-badge" style={{ position: 'static' }}>
                          Sold: {soldCount}
                        </div>
                       
                       {/* {isVariable && variantsCount > 1 && (
  <div className="pcus-variant-count-label" style={{ marginTop: '6px' }}>
    + {variantsCount} variants
  </div>
)} */}
                      </div>
                      <ReviewPills productId={p.id} />
                      <div className="pcus-prd-price-cart1">
                        <div className="pcus-prd-prices1">
                          <img
                            src={IconAED}
                            alt="AED currency icon"
                            style={{ width: 'auto', height: '13px', marginRight: '0px', verticalAlign: 'middle' }}
                          />
                 {onSale ? (
  <>
    <span className="pcus-prd-sale-price1">
      {parseFloat(displaySalePrice || 0).toFixed(2)}
    </span>
    <span className="pcus-prd-regular-price1">
      {parseFloat(displayRegularPrice || 0).toFixed(2)}
    </span>
    {displayRegularPrice && displaySalePrice && (
      <span className="pcus-prd-discount-box1">
        -{Math.round(
          ((parseFloat(displayRegularPrice) - parseFloat(displaySalePrice)) /
            parseFloat(displayRegularPrice)) *
            100
        )}
        % OFF
      </span>
    )}
  </>
) : (
  <span className="price1">{parseFloat(displayPrice || 0).toFixed(2)}</span>
)}
  </div>
                        <button
                          className={`pcus-prd-add-cart-btn10 ${
                            cartItems.some((item) => item.id === p.id) ? 'added-to-cart' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            flyToCart(e, p.images?.[0]?.src);
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

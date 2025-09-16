import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Rated.css';
import { useCart } from '../contexts/CartContext';
import MiniCart from '../components/MiniCart';
import AddCarticon from '../assets/images/addtocart.png';
import AddedToCartIcon from '../assets/images/added-cart.png';
import Adsicon from '../assets/images/summer-saving-coloured.png';
import IconAED from '../assets/images/Dirham 2.png';
import ProductCardReviews from './temp/productcardreviews'


import { 
  getProductsByTagSlugs, 
  getFirstVariation, 
  getCurrencySymbol 
} from '../api/woocommerce';

const PRODUCTS_PER_PAGE = 24;
const TITLE_LIMIT = 35;
const BEST_RATED_TAG_SLUG = 'Rated';

// Utility functions
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const truncate = (str) => (str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`);

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

const Rated = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [products, setProducts] = useState([]);
  const [variationPrices, setVariationPrices] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('AED');
  const [productsPage, setProductsPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const cartIconRef = useRef(null);

  // Fetch currency symbol
  useEffect(() => {
    const fetchCurrency = async () => {
      const symbol = await getCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    fetchCurrency();
  }, []);

  // Fetch products by "new" tag (manual pagination)
  const fetchProducts = useCallback(async (page = 1) => {
    setLoadingProducts(true);
    try {
      const data = await getProductsByTagSlugs([BEST_RATED_TAG_SLUG], page, PRODUCTS_PER_PAGE);
      if (page === 1) setProducts(data);
      else setProducts((prev) => [...prev, ...data]);
      setHasMoreProducts(data.length >= PRODUCTS_PER_PAGE);
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const loadMoreProducts = () => {
    if (!hasMoreProducts || loadingProducts) return;
    const nextPage = productsPage + 1;
    setProductsPage(nextPage);
    fetchProducts(nextPage);
  };

  // Handle product click
  const onProductClick = useCallback((slug, id) => {
    let recent = JSON.parse(localStorage.getItem('recentProducts')) || [];
    recent = recent.filter(rid => rid !== id);
    recent.unshift(id);
    localStorage.setItem('recentProducts', JSON.stringify(recent.slice(0, 5)));
    window.open(`/product/${slug}`, '_blank', 'noopener,noreferrer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch first variation prices for variable products
  useEffect(() => {
    products.forEach((p) => {
      if (p.type === 'variable' && !variationPrices[p.id]) fetchFirstVariationPrice(p.id);
    });
  }, [products]);

  const fetchFirstVariationPrice = async (productId) => {
    const variation = await getFirstVariation(productId);
    if (variation) {
      setVariationPrices((prev) => ({
        ...prev,
        [productId]: {
          price: variation.price,
          regular_price: variation.regular_price,
          sale_price: variation.sale_price,
        },
      }));
    }
  };

  const flyToCart = (e, imgSrc) => {
    if (!cartIconRef.current || !imgSrc) return;
    const cartRect = cartIconRef.current.getBoundingClientRect();
    const startRect = e.currentTarget.getBoundingClientRect();

    const clone = document.createElement('img');
    clone.src = imgSrc;
    Object.assign(clone.style, {
      position: 'fixed',
      zIndex: 9999,
      width: '60px',
      height: '60px',
      top: `${startRect.top}px`,
      left: `${startRect.left}px`,
      transition: 'all 0.7s ease-in-out',
      borderRadius: '50%',
      pointerEvents: 'none',
    });
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.top = `${cartRect.top}px`;
      clone.style.left = `${cartRect.left}px`;
      clone.style.opacity = '0';
      clone.style.transform = 'scale(0.2)';
    });

    setTimeout(() => clone.remove(), 800);
  };

  return (
    <div className="pcus-wrapper10" style={{ display: 'flex' }}>
      <div className="pcus-categories-products1" style={{ width: '100%', transition: 'width 0.3s ease' }}>
        <div className="pcus-title-section">
          <h2 className="pcus-main-title">
            <img src={Adsicon} style={{ maxWidth: '18px' }} alt="Ads icon" />TOP RATED{' '}
            <img src={Adsicon} style={{ maxWidth: '18px' }} alt="Ads icon" />
          </h2>
          <p className="pcus-sub-title">5-Star Products You’ll Love</p>
        </div>

        {loadingProducts && products.length === 0 ? (
          <div className="pcus-prd-grid12">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="pcus-no-products" style={{ minHeight: '300px', textAlign: 'center', paddingTop: '40px', fontSize: '18px', color: '#666' }}>
            No products found.
          </div>
        ) : (
          <div className="pcus-prd-grid12">
            {products.map((p) => {
              const isVariable = p.type === 'variable';
              const variationPriceInfo = variationPrices[p.id] || {};
              const displayRegularPrice = isVariable ? variationPriceInfo.regular_price : p.regular_price || p.price;
              const displaySalePrice = isVariable ? variationPriceInfo.sale_price : p.sale_price || null;
              const displayPrice = isVariable ? variationPriceInfo.price : p.price || p.regular_price || 0;
              const onSale = displaySalePrice && displaySalePrice !== displayRegularPrice;

              return (
                <div
                  key={p.id}
                  className="pcus-prd-card"
                  onClick={(e) => { e.stopPropagation(); onProductClick(p.slug, p.id); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onProductClick(p.slug)}
                  style={{ position: 'relative' }}
                >
                  <div className="pcus-image-wrapper1">
                    <img src={p.images?.[0]?.src || ''} alt={decodeHTML(p.name)} className="pcus-prd-image1 primary-img" loading="lazy" decoding="async" />
                    {p.images?.[1] && <img src={p.images[1].src} alt={`${decodeHTML(p.name)} - second`} className="pcus-prd-image1 secondary-img" loading="lazy" decoding="async" />}
                    {p.stock_status === 'outofstock' && <div className="pcus-stock-overlay10 out-of-stock">Out of Stock</div>}
                    {typeof p.stock_quantity === 'number' && p.stock_quantity < 50 && <div className="pcus-stock-overlay10 low-stock">Only {p.stock_quantity} left in stock</div>}
                  </div>

                  <div className="pcus-prd-info1">
                    <h2 className="pcus-prd-title1">{truncate(decodeHTML(p.name))}</h2>
                     <div style={{ padding: "0 0px" }}>
                                        <ProductCardReviews productId={p.id} soldCount={p.total_sales || 0} />
                                      </div>
                    <div className="pcus-prd-price-cart1">
                      <div className="pcus-prd-prices1">
                        <img src={IconAED} alt="AED currency icon" style={{ width: 'auto', height: '13px', verticalAlign: 'middle' }} />
                        {onSale ? (
                          <>
                            <span className="pcus-prd-sale-price1">{parseFloat(displaySalePrice || 0).toFixed(2)}</span>
                            <span className="pcus-prd-regular-price1">{parseFloat(displayRegularPrice || 0).toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="price1">{parseFloat(displayPrice || 0).toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        className={`pcus-prd-add-cart-btn10 ${cartItems.some(item => item.id === p.id) ? 'added-to-cart' : ''}`}
                        onClick={(e) => { e.stopPropagation(); flyToCart(e, p.images?.[0]?.src); addToCart(p, true); }}
                        aria-label={`Add ${decodeHTML(p.name)} to cart`}
                      >
                        <img src={cartItems.some(item => item.id === p.id) ? AddedToCartIcon : AddCarticon} alt="Add to cart" className="pcus-prd-add-cart-icon-img" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

export default memo(Rated);

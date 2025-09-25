// src/components/ProductCategory.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../assets/styles/ProductCategory.css";
import { useCart } from "../../../contexts/CartContext";
import MiniCart from "../../MiniCart";
import AddCarticon from "../../../assets/images/addtocart.png";
import AddedToCartIcon from "../../../assets/images/added-cart.png";
import IconAED from "../../../assets/images/Dirham 2.png";
import TitleImage from "../../../assets/images/bACK TO SCHOOL BANNER.webp";
import PlaceholderImage from "../../../assets/images/common/Placeholder.png";
import { throttle } from "lodash";
import { API_BASE, CONSUMER_KEY, CONSUMER_SECRET } from "../../../api/woocommerce";
import ProductCardReviews from "../../temp/productcardreviews";
import Product1 from '../../../assets/images/staticproducts//pressurewasher/1.webp';

const PAGE_SIZE = 10;
const PRODUCTS_PER_PAGE = 30;
const MAX_PRODUCTS = 500;

// Utility to decode HTML entities
const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Skeleton Loader
const SkeletonCard = () => (
  <div className="pcus-prd-card pcus-skeleton">
    <div className="pcus-prd-image-skel" />
    <div className="pcus-prd-info-skel">
      <div className="pcus-prd-title-skel" />
      <div className="pcus-prd-price-cart-skel" />
    </div>
  </div>
);

// Price Component
const Price = ({ value, className }) => {
  if (!value) return null;
  const price = parseFloat(value || 0).toFixed(2);
  const [int, dec] = price.split(".");
  return (
    <span className={className}>
      <span style={{ fontSize: "18px", fontWeight: "bold" }}>{int}</span>
      <span style={{ fontSize: "12px" }}>.{dec}</span>
    </span>
  );
};

// Shuffle Array
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Static Products
const staticProducts = [

  {
    id: " 68V Cordless Portable Car Wash Pressure Washer Gun with Dual ",
    name: "68V Cordless Portable Car Wash Pressure Washer Gun with Dual ",
    price: "299.00",
    regular_price: "89.90",
    sale_price: "149.00",
    images: [{ src: Product1 }],
     slug: "68v-cordless-portable-car-wash-pressure-washer-gun-with-dual",
    path: "/products/68v-cordless-portable-car-wash-pressure-washer-gun-with-dual",
    rating: 4,
    reviews: 18,
    sold: 120
  },
];

const staticPositions = [2, 11];

const ProductCategory = () => {
  const { addToCart, cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const [categories, setCategories] = useState([]);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [badgeText, setBadgeText] = useState("MEGA OFFER");
  const [animate, setAnimate] = useState(true);

  const categoriesRef = useRef(null);
  const cartIconRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [visibleCount, setVisibleCount] = useState(30); 

  // check if current category has "Enable Mega Offer"



  // Fetch categories
const fetchCategories = useCallback(async (page = 1) => {
  setLoadingCategories(true);
  try {
    const res = await fetch(
      `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PAGE_SIZE}&page=${page}&orderby=name`
    );
    const data = await res.json();
    // now each category has enable_offer
    setCategories((prev) => (page === 1 ? data : [...prev, ...data]));
    setHasMoreCategories(data.length === PAGE_SIZE);
  } catch {
    setHasMoreCategories(false);
  } finally {
    setLoadingCategories(false);
  }
}, []);


  // Badge animation
  useEffect(() => {
    const texts = ["MEGA OFFER", "HURRY UP"];
    let idx = 0;
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        idx = (idx + 1) % texts.length;
        setBadgeText(texts[idx]);
        setAnimate(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products
// Fetch products
const fetchProducts = useCallback(
  async (page = 1, categoryId = selectedCategoryId) => {
    setLoadingProducts(true);
    try {
      let sortedData = [];

      if (categoryId === "all") {
        // 1️⃣ Fetch top categories (limit to 20 for speed, adjust as needed)
        const catRes = await fetch(
          `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=20`
        );
        const categoriesData = await catRes.json();

        // 2️⃣ Fetch 5 products per category in parallel
        const productPromises = categoriesData.map(cat =>
          fetch(
            `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=5&page=1&category=${cat.id}&_fields=id,slug,name,images,price,regular_price,sale_price,date_created`
          )
            .then(res => res.json())
            .catch(() => [])
        );

        const allProductsArrays = await Promise.all(productPromises);
        let mixedProducts = allProductsArrays.flat();

        if (mixedProducts.length > 0) {
          // 3️⃣ Identify newest product
          const newestProduct = mixedProducts.reduce((latest, prod) =>
            new Date(prod.date_created) > new Date(latest.date_created) ? prod : latest
          , mixedProducts[0]);

          // 4️⃣ Shuffle the rest
          const olderProducts = mixedProducts.filter(p => p.id !== newestProduct.id);
          sortedData = [...shuffleArray(olderProducts), newestProduct];
        }

      } else {
        // Normal category fetch
        let url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PRODUCTS_PER_PAGE}&page=${page}&_fields=id,slug,name,images,price,regular_price,sale_price,date_created&orderby=date&order=asc`;
        if (categoryId !== "all") url += `&category=${categoryId}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.length > 0) {
          const newestProduct = data[data.length - 1];
          const olderProducts = shuffleArray(data.slice(0, data.length - 1));
          sortedData = [...olderProducts, newestProduct];
        }
      }

      // 5️⃣ Update state
      setProducts(prev => (page === 1 ? sortedData : [...prev, ...sortedData]));
setHasMoreProducts(sortedData.length > 0 && products.length + sortedData.length < MAX_PRODUCTS);

    } catch {
      setHasMoreProducts(false);
    } finally {
      setLoadingProducts(false);
    }
  },
  [selectedCategoryId]
);



  // Initial fetch
  useEffect(() => {
    if (!isHomePage) return;
    setProducts([]);
    setProductsPage(1);
      setVisibleCount(30);  
    fetchProducts(1, selectedCategoryId);
    fetchCategories(1);
  }, [isHomePage, selectedCategoryId, fetchProducts, fetchCategories]);

  // Arrow visibility for categories scroll
  const updateArrowVisibility = useCallback(() => {
    const el = categoriesRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollWidth - el.scrollLeft > el.clientWidth + 10);
  }, []);

  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;
    const throttled = throttle(updateArrowVisibility, 100);
    el.addEventListener("scroll", throttled);
    updateArrowVisibility();
    return () => el.removeEventListener("scroll", throttled);
  }, [categories, updateArrowVisibility]);

  // Load more products
const loadMoreProducts = useCallback(() => {
  if (loadingProducts || !hasMoreProducts) return;

  const nextPage = productsPage + 1;
  setProductsPage(nextPage);
  fetchProducts(nextPage, selectedCategoryId);
}, [loadingProducts, hasMoreProducts, productsPage, fetchProducts, selectedCategoryId]);

  // Fly to cart animation
  const flyToCart = (e, imgSrc) => {
    if (!cartIconRef.current || !imgSrc) return;
    const cartRect = cartIconRef.current.getBoundingClientRect();
    const startRect = e.currentTarget.getBoundingClientRect();

    const clone = document.createElement("img");
    clone.src = imgSrc;
    clone.style.position = "fixed";
    clone.style.zIndex = 9999;
    clone.style.width = "60px";
    clone.style.height = "60px";
    clone.style.top = `${startRect.top}px`;
    clone.style.left = `${startRect.left}px`;
    clone.style.transition = "all 0.7s ease-in-out";
    clone.style.borderRadius = "50%";
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.top = `${cartRect.top}px`;
      clone.style.left = `${cartRect.left}px`;
      clone.style.opacity = "0";
      clone.style.transform = "scale(0.2)";
    });

    setTimeout(() => clone.remove(), 800);
  };

  // Handle product click
  const handleProductClick = (product) => {
    setProducts((prev) => {
      if (!prev.length) return prev;
      const newestProduct = prev[prev.length - 1];
      const olderProducts = prev.slice(0, prev.length - 1);
      const newOlderProducts = [product, ...olderProducts.filter((p) => p.id !== product.id)];
      return [...newOlderProducts, newestProduct];
    });

    window.open(`/product/${product.slug}`, "_blank");
  };

  // Merge static + dynamic products
const getMergedProducts = () => {
  const merged = [...products];
  staticPositions.forEach((pos, i) => {
    if (i < staticProducts.length && pos <= merged.length) {
      merged.splice(pos, 0, { ...staticProducts[i], isStatic: true });
    }
  });
  return merged;
};

const selectedCategory = categories.find(c => c.id === selectedCategoryId);
const showMegaOffer = selectedCategory?.enable_offer;
  // Render Products
  const renderProducts = () => {
    const mergedProducts = getMergedProducts();
return mergedProducts.slice(0, visibleCount).map((p, index) => {
      if (p.isStatic) {
        return (
          <div
            key={p.id}
            className="pcus-prd-card static-product-card"
            onClick={() => p.path && (window.location.href = p.path)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "#ff6207",
                color: "#fff",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 6px",
                borderRadius: "4px",
                zIndex: 2,
              }}
            >
              Fast Moving
            </div>

            <div className="pcus-image-wrapper" style={{ position: "relative" }}>
              <img
                src={p.images[0].src}
                alt={decodeHTML(p.name)}
                className="pcus-prd-image1 primary-img"
              />
            </div>

            <div className="pcus-prd-info12">
              <h2 className="pcus-prd-title1">{decodeHTML(p.name)}</h2>
              <div
                className="pcus-prd-dummy-reviews"
                style={{ display: "flex", alignItems: "center", margin: "0px 5px" }}
              >
                <div style={{ color: "#FFD700", marginRight: "8px" }}>
                  {"★".repeat(p.rating)}{"☆".repeat(5 - p.rating)}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>
                  ({p.reviews})
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>{p.sold} sold</div>
              </div>
              <div
                style={{
                  height: "1px",
                  width: "100%",
                  backgroundColor: "lightgrey",
                  margin: "0px 0 2px 0",
                  borderRadius: "1px",
                }}
              />
              <div className="prc-row-abc123">
                <div className="prc-left-abc123">
                                  <img src={IconAED} alt="AED" style={{ width: "auto", height: "12px", marginRight: "0px", verticalAlign: "middle" }} />
                  <Price value={p.sale_price} className="prc-sale-abc123" />
                  <Price value={p.regular_price} className="prc-regular-abc123" />
                  {p.sale_price < p.regular_price && (
                    <span className="prc-off-abc123">
                      {Math.round(((p.regular_price - p.sale_price) / p.regular_price) * 100)}% Off
                    </span>
                  )}
                </div>
              </div>
              <div className="prc-row-badge-btn">
                <div className="prc-badge-abc123">Fast Moving Product</div>
                <button className="prc-btn-abc123">Buy Now</button>
              </div>
            </div>
          </div>
        );
      }

      const hasSale = p.sale_price && p.sale_price !== p.regular_price;
      return (
        <div key={p.id} className="pcus-prd-card" onClick={() => handleProductClick(p)} style={{ cursor: "pointer" }}>
          <div className="pcus-image-wrapper1">
            <img src={p.images?.[0]?.src || PlaceholderImage} alt={decodeHTML(p.name)} className="pcus-prd-image1 primary-img" loading="lazy" decoding="async" />
            {p.images?.[1] ? (
              <img src={p.images[1].src} alt={decodeHTML(p.name)} className="pcus-prd-image1 secondary-img" loading="lazy" decoding="async" />
            ) : (
              <img src={PlaceholderImage} alt={decodeHTML(p.name)} className="pcus-prd-image1 secondary-img" />
            )}
            {hasSale && <span className="pcus-prd-discount-box1">-{Math.round(((parseFloat(p.regular_price) - parseFloat(p.sale_price)) / parseFloat(p.regular_price)) * 100)}% OFF</span>}
           {showMegaOffer && index === 0 && (
              <div className="mega-offer-badge">
                <span className="mega-offer-text" style={{ transform: animate ? "translateY(0)" : "translateY(100%)", opacity: animate ? 1 : 0, display: "inline-block" }}>
                  {badgeText}
                </span>
              </div>
            )}
          </div>

          <div className="pcus-prd-info12">
            <h2 className="pcus-prd-title1">{decodeHTML(p.name)}</h2>
            <ProductCardReviews productId={p.id} />
            <div style={{ height: "1px", width: "100%", backgroundColor: "lightgrey", margin: "0px 0 2px 0", borderRadius: "1px" }} />
            <div className="pcus-prd-price-cart1">
              <div className="pcus-prd-prices1">
                <img src={IconAED} alt="AED" style={{ width: "auto", height: "12px", marginRight: "0px", verticalAlign: "middle" }} />
                {hasSale ? (
                  <>
                    <Price value={p.sale_price} className="pcus-prd-sale-price12" />
                    <Price value={p.regular_price} className="pcus-prd-regular-price12" />
                  </>
                ) : (
                  <Price value={p.price} className="price1" />
                )}
              </div>
              <button
                className={`pcus-prd-add-cart-btn ${cartItems.some((item) => item.id === p.id) ? "added-to-cart" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  flyToCart(e, p.images?.[0]?.src);
                  addToCart(p, true);
                }}
                aria-label={`Add ${decodeHTML(p.name)} to cart`}
              >
                <img src={cartItems.some((item) => item.id === p.id) ? AddedToCartIcon : AddCarticon} alt="cart icon" className="pcus-prd-add-cart-icon-img" />
              </button>
              <div id="cart-icon" ref={cartIconRef} style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, cursor: "pointer" }} />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="pcus-wrapper3" style={{ display: "flex" }}>
      <div className="pcus-categories-products1" style={{ width: "100%", transition: "width 0.3s ease" }}>
        {/* Banner */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={TitleImage} className="schoolimage" style={{ maxWidth: "400px", width: "100%", height: "auto" }} alt="Category banner" />
        </div>

        {/* Categories */}
        <div className="pcus-categories-wrapper1 pcus-categories-wrapper3">
          {canScrollLeft && (
            <button className="pcus-arrow-btn" onClick={() => categoriesRef.current.scrollBy({ left: -200, behavior: "smooth" })}>‹</button>
          )}
          <div className="pcus-categories-scroll" ref={categoriesRef}>
            <button className={`pcus-category-btn ${selectedCategoryId === "all" ? "active" : ""}`} onClick={() => setSelectedCategoryId("all")}>Recommended</button>
            {categories.map((cat) => (
              <button key={cat.id} className={`pcus-category-btn ${selectedCategoryId === cat.id ? "active" : ""}`} onClick={() => setSelectedCategoryId(cat.id)} title={decodeHTML(cat.name)}>
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
                {loadingCategories ? "Loading…" : "Load More"}
              </button>
            )}
          </div>
          {canScrollRight && (
            <button className="pcus-arrow-btn" onClick={() => categoriesRef.current.scrollBy({ left: 200, behavior: "smooth" })}>›</button>
          )}
        </div>

        {/* Products */}
        {loadingProducts && products.length === 0 ? (
          <div className="pcus-prd-grid001">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : products.length === 0 ? (
          <div className="pcus-no-products" style={{ minHeight: "300px", textAlign: "center", paddingTop: "40px", fontSize: "18px", color: "#666" }}>No products found.</div>
        ) : (
          <>
            <div className="pcus-prd-grid001">
              {renderProducts()}
              {loadingProducts && products.length > 0 && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
            </div>

            {/* Load More */}
           {/* Load More */}
<div className="pcus-load-more-wrapper" style={{ textAlign: "center", margin: "24px 0" }}>
  {hasMoreProducts ? (
    <button
      className="pcus-load-more-btn"
      onClick={loadMoreProducts}
      disabled={loadingProducts}
      style={{
        padding: "10px 20px",
        fontSize: "14px",
        backgroundColor: "#ff6207ff",
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        cursor: loadingProducts ? "not-allowed" : "pointer"
      }}
    >
      {loadingProducts ? "Loading…" : "Load More"}
    </button>
  ) : (
    <span style={{ color: "#666", fontSize: "14px" }}>No more products</span>
  )}
</div>


          </>
        )}
      </div>
      <MiniCart />
    </div>
  );
};

export default ProductCategory;

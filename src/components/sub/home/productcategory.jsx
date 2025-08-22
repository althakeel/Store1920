import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/ProductCategory.css";
import { useCart } from "../../../contexts/CartContext";
import MiniCart from "../../MiniCart";
import AddCarticon from "../../../assets/images/addtocart.png";
import AddedToCartIcon from "../../../assets/images/added-cart.png";
import Adsicon from "../../../assets/images/summer-saving-coloured.png";
import IconAED from "../../../assets/images/Dirham 2.png";
import { throttle } from "lodash";
import ProductCardReviews from "../../temp/productcardreviews";
import TitleImage from '../../../assets/images//bACK TO SCHOOL BANNER.webp'

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";

const PAGE_SIZE = 10;
const PRODUCTS_PER_PAGE = 40;
const TITLE_LIMIT = 35;

const badgeLabelMap = {
  best_seller: "Best Seller",
  recommended: "Recommended",
};

const badgeColors = ["darkgreen", "orange", "red"];

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const ReviewPills = memo(({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(
      `https://db.store1920.com/wp-json/custom-reviews/v1/product/${productId}`
    )
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => console.error("Review fetch error", err));
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
  let recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
  recent = recent.filter((id) => id !== productId);
  recent.unshift(productId);
  localStorage.setItem("recentProducts", JSON.stringify(recent.slice(0, 5)));
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

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");

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

  const [promoImage, setPromoImage] = useState("");
  const [promoSubtitle, setPromoSubtitle] = useState("");
  const [badgeText, setBadgeText] = useState("MEGA OFFER");
  const [animate, setAnimate] = useState(true);

  const [quickViewImages, setQuickViewImages] = useState([]);
  const [quickViewTitle, setQuickViewTitle] = useState("");
  const [showQuickView, setShowQuickView] = useState(false);

  const openQuickView = (images, title) => {
    setQuickViewImages(images);
    setQuickViewTitle(title);
    setShowQuickView(true);
  };

  const closeQuickView = () => setShowQuickView(false);

  useEffect(() => {
    const texts = ["MEGA OFFER", "HURRY UP"];
    let idx = 0;

    const interval = setInterval(() => {
      setAnimate(false); // start moving down/fade out

      setTimeout(() => {
        idx = (idx + 1) % texts.length;
        setBadgeText(texts[idx]);
        setAnimate(true); // slide up / fade in
      }, 500); // match transition duration
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeColorIndex((idx) => (idx + 1) % badgeColors.length);
    }, 600000); // rotate every 10 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchCurrencySymbol() {
      try {
        const res = await fetch(
          `${API_BASE}/settings/general?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
        );
        const data = await res.json();
        const currencyCode =
          data.find((item) => item.id === "woocommerce_currency")?.value ||
          "USD";
        const map = { USD: "$", EUR: "€", GBP: "£", AED: "د.إ", INR: "₹" };
        setCurrencySymbol(map[currencyCode] || "$");
      } catch (e) {
        console.error(e);
      }
    }
    fetchCurrencySymbol();
  }, []);

  function Price({ value, className }) {
    const price = parseFloat(value || 0).toFixed(2);
    const [integerPart, decimalPart] = price.split(".");

    return (
      <span className={className}>
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          {integerPart}
        </span>
        <span style={{ fontSize: "12px" }}>.{decimalPart}</span>
      </span>
    );
  }

  useEffect(() => {
    fetch("https://db.store1920.com/wp-json/custom/v1/promo")
      .then((res) => res.json())
      .then((data) => {
        console.log("Promo data:", data);
        const promo = data.data || data;
        setPromoImage(promo.promo_image || "");
        setPromoSubtitle(promo.promo_subtitle || "");
      })
      .catch((err) => console.error("Fetch promo error", err));
  }, []);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];

    if (recent.length === 0) {
      setSortedProducts(products);
      return;
    }

    const recentSet = new Set(recent);

    const recentProducts = recent
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);

    const remainingProducts = products.filter((p) => !recentSet.has(p.id));
    setSortedProducts([...recentProducts, ...remainingProducts]);
  }, [products]);

  useEffect(() => {
    products.forEach((p) => {
      if (p.type === "variable" && !productVariations[p.id]) {
        fetchAllVariations(p.id);
      }
    });
  }, [products]);

  const getProductBadges = (product) => {
    const badges = [];
    product.meta_data?.forEach((meta) => {
      if (
        meta.key === "_best_seller" &&
        (meta.value === "1" || meta.value === true)
      ) {
        badges.push("best_seller");
      }
      if (
        meta.key === "_recommended" &&
        (meta.value === "1" || meta.value === true)
      ) {
        badges.push("recommended");
      }
    });
    return badges;
  };

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
      console.error(
        `Error fetching variations for product ${productId}`,
        error
      );
    }
  };
  const fetchCategories = useCallback(async (page = 1) => {
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
  }, []);

  const fetchProducts = useCallback(
    async (page = 1, categoryId = selectedCategoryId) => {
      setLoadingProducts(true);
      try {
        const url =
          `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${PRODUCTS_PER_PAGE}&page=${page}&orderby=date&order=desc` +
          (categoryId !== "all" ? `&category=${categoryId}` : "");
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

  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  useEffect(() => {
    setProductsPage(1);
    setHasMoreProducts(true);
    fetchProducts(1, selectedCategoryId);
  }, [selectedCategoryId, fetchProducts]);

  const loadMoreProducts = useCallback(
    throttle(() => {
      if (loadingProducts || !hasMoreProducts) return;
      const nextPage = productsPage + 1;
      setProductsPage(nextPage);
      fetchProducts(nextPage, selectedCategoryId);
    }, 1000),
    [loadingProducts, hasMoreProducts, productsPage, selectedCategoryId]
  );

  useEffect(() => {
    products.forEach((p) => {
      if (p.type === "variable") {
        fetchFirstVariation(p.id);
      }
    });
  }, [products]);

  const fetchFirstVariation = async (productId) => {
    if (variationPrices[productId]) return;

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
      console.error(
        `Error fetching first variation for product ${productId}`,
        error
      );
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
    el.addEventListener("scroll", throttledUpdate);
    updateArrowVisibility();

    return () => el.removeEventListener("scroll", throttledUpdate);
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

    el.addEventListener("mousedown", start);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", stop);
    el.addEventListener("mouseup", stop);

    return () => {
      el.removeEventListener("mousedown", start);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", stop);
      el.removeEventListener("mouseup", stop);
    };
  }, []);

  const truncate = (str) =>
    str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`;

  const renderStars = (ratingStr) => {
    const rating = parseFloat(ratingStr);
    return (
      <span className="pcus-stars">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? "pcus-star filled" : "pcus-star"}
          >
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

  const scrollCats = (dir) => {
    const el = categoriesRef.current;
    if (el)
      el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const onProductClick = useCallback((slug, id) => {
    let recent = JSON.parse(localStorage.getItem("recentProducts")) || [];

    recent = recent.filter((rid) => rid !== id);
    recent.unshift(id);
    localStorage.setItem("recentProducts", JSON.stringify(recent.slice(0, 5)));

    const url = `/product/${slug}`;
    window.open(url, "_blank", "noopener,noreferrer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const throttledHandleScroll = throttle(() => {
      if (loadingProducts || !hasMoreProducts) return;

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        loadMoreProducts();
      }
    }, 200);
    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [loadingProducts, hasMoreProducts, productsPage, loadMoreProducts]);

  return (
    <div className="pcus-wrapper3" style={{ display: "flex" }}>
      <div
        className="pcus-categories-products1"
        style={{ width: "100%", transition: "width 0.3s ease" }}
      >
        {/* <div className="pcus-title-section">
          <h2 className="pcus-main-title">
            <img src={Adsicon} style={{ maxWidth: "18px" }} alt="Ads icon" />{" "}
            SUMMER SAVINGS{" "}
            <img src={Adsicon} style={{ maxWidth: "18px" }} alt="Ads icon" />
          </h2>
          <p className="pcus-sub-title">BROWSE WHAT EXCITES YOU</p>
        </div>
        <div className="pcus-title-section">
          <h2 className="pcus-main-title">
            {promoImage && (
              <img
                src={promoImage}
                style={{ maxWidth: "18px" }}
                alt="Promo icon"
              />
            )}
            {promoImage && (
              <img
                src={promoImage}
                style={{ maxWidth: "18px" }}
                alt="Promo icon"
              />
            )}
          </h2>
          <p className="pcus-sub-title">{promoSubtitle}</p>
       
        </div> */}

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <img src={TitleImage} className="schoolimage" style={{ maxWidth: '400px', width: '100%', height: 'auto' }} />
</div>
   
        <div className="pcus-categories-wrapper1 pcus-categories-wrapper3">
          {canScrollLeft && (
            <button
              className="pcus-arrow-btn"
              onClick={() => scrollCats("left")}
              aria-label="Prev"
            >
              ‹
            </button>
          )}
          <div className="pcus-categories-scroll" ref={categoriesRef}>
            <button
              className={`pcus-category-btn ${
                selectedCategoryId === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedCategoryId("all")}
            >
              Recommended
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`pcus-category-btn ${
                  selectedCategoryId === cat.id ? "active" : ""
                }`}
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
                {loadingCategories ? "Loading…" : "Load More"}
              </button>
            )}
          </div>
          {canScrollRight && (
            <button
              className="pcus-arrow-btn"
              onClick={() => scrollCats("right")}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>

        {loadingProducts && products.length === 0 ? (
          <div className="pcus-prd-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            className="pcus-no-products"
            style={{
              minHeight: "300px",
              textAlign: "center",
              paddingTop: "40px",
              fontSize: "18px",
              color: "#666",
            }}
          >
            No products found.
          </div>
        ) : (
          <>
            <div className="pcus-prd-grid">
              {sortedProducts.map((p) => {
                const hasMegaOffer = !!p.enable_offer; // true if enabled, false otherwise

                const isVariable = p.type === "variable";
                let stockQty = 0;
                let inStock = false;

                if (isVariable) {
                  const variations = productVariations[p.id];
                  if (!variations) {
                    // Variations not loaded yet
                    return <span>Loading stock…</span>;
                  }

                  variations.forEach((v) => {
                    const qty = Number(v.stock_quantity) || 0;
                    stockQty += qty;

                    if (
                      v.stock_status === "instock" ||
                      v.backorders === "allowed"
                    ) {
                      inStock = true;
                    }
                  });
                } else {
                  stockQty = Number(p.stock_quantity) || 0;
                  if (
                    p.stock_status === "instock" ||
                    p.backorders === "allowed"
                  ) {
                    inStock = true;
                  }
                }

                // Display badge
                const stockBadge = inStock
                  ? stockQty > 0
                    ? `Only ${stockQty} left`
                    : "In stock"
                  : "Out of stock";
                const badgeColor = inStock ? "green" : "red";
                const variationPriceInfo = variationPrices[p.id] || {
                  price: null,
                  regular_price: null,
                  sale_price: null,
                };
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

                const onSale =
                  displaySalePrice && displaySalePrice !== displayRegularPrice;
                const badges = [];
                const soldCount = 0;
                const priceLoaded =
                  !isVariable ||
                  (isVariable && variationPriceInfo.price !== null);

                return (
                  <div
                    key={p.id}
                    className="pcus-prd-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(p.slug, p.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && onProductClick(p.slug)
                    }
                    style={{ position: "relative" }}
                  >
                    <div className="pcus-image-wrapper1">
                      <img
                        src={p.images?.[0]?.src || ""}
                        alt={decodeHTML(p.name)}
                        className="pcus-prd-image1 primary-img"
                        loading="lazy"
                        decoding="async"
                      />
                      {p.images?.[1] && (
                        <img
                          src={p.images[1].src}
                          alt={decodeHTML(p.name)}
                          className="pcus-prd-image1 secondary-img"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {hasMegaOffer && (
                        <div className="mega-offer-badge">
                          <span
                            className="mega-offer-text"
                            style={{
                              transform: animate
                                ? "translateY(0)"
                                : "translateY(100%)",
                              opacity: animate ? 1 : 0,
                              display: "inline-block",
                            }}
                          >
                            {badgeText}
                          </span>
                        </div>
                      )}

                      {/* {p.images?.length > 0 && (
    <button
      className="quick-view-btn"
      onClick={(e) => {
        e.stopPropagation();
        openQuickView(p.images, decodeHTML(p.name));
      }}
    >
      Quick View
    </button>
  )} */}
                    </div>
                    <div className="pcus-prd-info1">
                      <h3 className="pcus-prd-title1">
                        {decodeHTML(p.name)}
                        {/* {getProductBadges(p).map((badge, idx) => (
    <span
      key={idx}
      className="pcus-badge"
      style={{ backgroundColor: badgeColors[idx % badgeColors.length] }}
    >
      {badgeLabelMap[badge] || badge}
    </span>
  ))} */}
                      </h3>
                      <ProductCardReviews />
                      <div className="pcus-prd-price-cart1">
                        <div className="pcus-prd-prices1">
                          <img
                            src={IconAED}
                            alt="AED currency icon"
                            style={{
                              width: "auto",
                              height: "12px",
                              marginRight: "0px",
                              verticalAlign: "middle",
                            }}
                          />
                          {onSale ? (
                            <>
                              <Price
                                value={displaySalePrice}
                                className="pcus-prd-sale-price1"
                              />
                              <Price
                                value={displayRegularPrice}
                                className="pcus-prd-regular-price1"
                              />
                              {displayRegularPrice && displaySalePrice && (
                                <span className="pcus-prd-discount-box1">
                                  {" "}
                                  -
                                  {Math.round(
                                    ((parseFloat(displayRegularPrice) -
                                      parseFloat(displaySalePrice)) /
                                      parseFloat(displayRegularPrice)) *
                                      100
                                  )}
                                  % OFF
                                </span>
                              )}
                            </>
                          ) : (
                            <Price value={displayPrice} className="price1" />
                          )}
                        </div>

                        {showQuickView && (
                          <div
                            className="quick-view-modal"
                            onClick={closeQuickView}
                          >
                            <div
                              className="quick-view-content"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="close-btn"
                                onClick={closeQuickView}
                              >
                                ×
                              </button>
                              <h3>{quickViewTitle}</h3>
                              <div className="quick-view-images">
                                {quickViewImages.map((img, i) => (
                                  <img
                                    key={i}
                                    src={img.src}
                                    alt={`${quickViewTitle} ${i}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          className={`pcus-prd-add-cart-btn ${
                            cartItems.some((item) => item.id === p.id)
                              ? "added-to-cart"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            flyToCart(e, p.images?.[0]?.src);
                            addToCart(p, true);
                          }}
                          aria-label={`Add ${decodeHTML(p.name)} to cart`}
                        >
                          <img
                            src={
                              cartItems.some((item) => item.id === p.id)
                                ? AddedToCartIcon
                                : AddCarticon
                            }
                            alt={
                              cartItems.some((item) => item.id === p.id)
                                ? "Added to cart"
                                : "Add to cart"
                            }
                            className="pcus-prd-add-cart-icon-img"
                          />
                        </button>

                        <div
                          id="cart-icon"
                          ref={cartIconRef}
                          style={{
                            position: "fixed",
                            top: 20,
                            right: 20,
                            zIndex: 1000,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      {/* {inStock ? (
  stockQty > 0 ? (
    <span className="pcus-bdge" style={{ backgroundColor: "green" }}>
      Only {stockQty} left
    </span>
  ) : (
    <span className="pcusadge" style={{ backgroundColor: "green" }}>
      In stock
    </span>
  )
) : (
  <span className="pcusdge" style={{ backgroundColor: "red" }}>
    Out of stock
  </span>
)} */}
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMoreProducts && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <button
                  className="pcus-load-more-btn"
                  onClick={loadMoreProducts}
                  disabled={loadingProducts}
                >
                  {loadingProducts ? "Loading…" : "Load More"}
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

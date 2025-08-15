import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { throttle } from "lodash";
import AddCarticon from "../assets/images/addtocart.png";
import AddedToCartIcon from "../assets/images/added-cart.png";
import Adsicon from "../assets/images/summer-saving-coloured.png";
import IconAED from "../assets/images/Dirham 2.png";
import ProductCardReviews from "../components/temp/productcardreviews";
import "../assets/styles/CategoryProducts.css";

const TITLE_LIMIT = 35;

const CategoryProducts = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [productsPage, setProductsPage] = useState(1);
  const [promoImage, setPromoImage] = useState(Adsicon);
  const [promoSubtitle, setPromoSubtitle] = useState("BROWSE WHAT EXCITES YOU");
  const [cartItems, setCartItems] = useState([]);

  const categoriesRef = useRef(null);
  const cartIconRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
  const AUTH = {
    username: "ck_c4e35c0d93df1f96cae81fccae967b8969a1eb85",
    password: "cs_b2b2ab3b1cdbc7db01cd718dc52b8f5a5711a6e5",
  };

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const truncate = (str) =>
    str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`;

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/categories`, { auth: AUTH });
      setCategories(res.data.filter((c) => c.parent === 0));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const fetchProducts = useCallback(
    async (categoryId = selectedCategoryId, page = productsPage) => {
      setLoadingProducts(true);
      try {
        const params = { per_page: 20, page };
        if (categoryId !== "all") params.category = categoryId;

        const res = await axios.get(`${API_BASE}/products`, { auth: AUTH, params });
        if (page === 1) setProducts(res.data);
        else setProducts((prev) => [...prev, ...res.data]);

        if (res.data.length < 20) setHasMoreProducts(false);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoadingProducts(false);
      }
    },
    [selectedCategoryId, productsPage]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId, fetchProducts]);

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

  const addToCart = (product) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const scrollCats = (dir) => {
    const el = categoriesRef.current;
    if (el) el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
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

  const onProductClick = (slug, id) => {
    let recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
    recent = recent.filter((rid) => rid !== id);
    recent.unshift(id);
    localStorage.setItem("recentProducts", JSON.stringify(recent.slice(0, 5)));
    window.open(`/product/${slug}`, "_blank", "noopener,noreferrer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pcus-wrapper3">
      {/* Promo Section */}
      <div className="pcus-title-section">
        <h2 className="pcus-main-title">
          <img src={promoImage} alt="Promo icon" style={{ maxWidth: "18px" }} />{" "}
          SUMMER SAVINGS{" "}
          <img src={promoImage} alt="Promo icon" style={{ maxWidth: "18px" }} />
        </h2>
        <p className="pcus-sub-title">{promoSubtitle}</p>
      </div>

      {/* Categories Scroll */}
      <div className="pcus-categories-wrapper1 pcus-categories-wrapper3">
        {canScrollLeft && <button className="pcus-arrow-btn" onClick={() => scrollCats("left")}>‹</button>}
        <div className="pcus-categories-scroll" ref={categoriesRef}>
          <button
            className={`pcus-category-btn ${selectedCategoryId === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategoryId("all")}
          >
            Recommended
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pcus-category-btn ${selectedCategoryId === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategoryId(cat.id)}
            >
              {decodeHTML(cat.name)}
            </button>
          ))}
        </div>
        {canScrollRight && <button className="pcus-arrow-btn" onClick={() => scrollCats("right")}>›</button>}
      </div>

      {/* Products Grid */}
      <div className="pcus-prd-grid">
        {loadingProducts
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="pcus-prd-skeleton" />)
          : products.map((p) => {
              const onSale = p.sale_price && p.sale_price !== p.regular_price;

              return (
                <div
                  key={p.id}
                  className="pcus-prd-card"
                  onClick={() => onProductClick(p.slug, p.id)}
                >
                  <div className="pcus-image-wrapper1">
                    <img src={p.images?.[0]?.src || ""} alt={decodeHTML(p.name)} className="pcus-prd-image1 primary-img" />
                    {p.images?.[1] && <img src={p.images[1].src} alt={decodeHTML(p.name)} className="pcus-prd-image1 secondary-img" />}
                  </div>

                  <div className="pcus-prd-info1">
                    <h3 className="pcus-prd-title1">{truncate(decodeHTML(p.name))}</h3>
                    <ProductCardReviews reviews={p.reviews_count || 0} rating={p.average_rating || 0} sold={p.total_sales || 0} />

                    <div className="pcus-prd-price-cart1">
                      <div className="pcus-prd-prices1">
                        <img src={IconAED} alt="AED" style={{ width: "auto", height: "13px", marginRight: "2px" }} />
                        {onSale ? (
                          <>
                            <span className="pcus-prd-sale-price1">{p.sale_price}</span>
                            <span className="pcus-prd-regular-price1">{p.regular_price}</span>
                            <span className="pcus-prd-discount-box1">
                              -{Math.round(((p.regular_price - p.sale_price) / p.regular_price) * 100)}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="price1">{p.price || p.regular_price}</span>
                        )}
                      </div>

                      <button
                        className={`pcus-prd-add-cart-btn ${cartItems.some(item => item.id === p.id) ? "added-to-cart" : ""}`}
                        onClick={(e) => { e.stopPropagation(); flyToCart(e, p.images?.[0]?.src); addToCart(p); }}
                      >
                        <img
                          src={cartItems.some(item => item.id === p.id) ? AddedToCartIcon : AddCarticon}
                          alt={cartItems.some(item => item.id === p.id) ? "Added to cart" : "Add to cart"}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Load More */}
      {hasMoreProducts && !loadingProducts && (
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <button
      onClick={() => {
        const nextPage = productsPage + 1;
        setProductsPage(nextPage);
        fetchProducts(selectedCategoryId, nextPage);
      }}
      className="load-more-btn"
    >
      Load More
    </button>
  </div>
)}

      <div ref={cartIconRef} style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }} />
    </div>
  );
};

export default CategoryProducts;

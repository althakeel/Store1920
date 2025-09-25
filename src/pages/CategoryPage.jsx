import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import MiniCart from "../components/MiniCart";
import AddCartIcon from "../assets/images/addtocart.png";
import AddedToCartIcon from "../assets/images/added-cart.png";
import IconAED from "../assets/images/Dirham 2.png";
import PlaceHolderIcon from "../assets/images/common/Placeholder.png";
import ProductCardReviews from "../components/temp/productcardreviews";
import "../assets/styles/categorypageid.css";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";

const PRODUCTS_PER_PAGE = 22;
const TITLE_LIMIT = 22;

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const Category = () => {
  const { slug } = useParams();
  const { addToCart, cartItems } = useCart();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const cartIconRef = useRef(null);
  const navigate = useNavigate();

  // --- Fetch category info and products by slug ---
  const fetchCategoryAndProducts = async (pageNum = 1) => {
    if (!slug) return;
    setLoading(true);

    try {
      // 1️⃣ Fetch category by slug
      const catRes = await axios.get(`${API_BASE}/products/categories`, {
        params: {
          slug,
          consumer_key: CONSUMER_KEY,
          consumer_secret: CONSUMER_SECRET,
        },
      });

      if (catRes.data.length === 0) {
        setCategory({ id: null, name: slug });
        setProducts([]);
        setHasMore(false);
        setInitialLoading(false);
        return;
      }

      const cat = catRes.data[0];
      setCategory(cat);

      // 2️⃣ Fetch products by category ID
      const prodRes = await axios.get(`${API_BASE}/products`, {
        params: {
          category: cat.id,
          per_page: PRODUCTS_PER_PAGE,
          page: pageNum,
          consumer_key: CONSUMER_KEY,
          consumer_secret: CONSUMER_SECRET,
        },
      });

      const newUnique = prodRes.data.filter(
        (p) => !products.some((existing) => existing.id === p.id)
      );

      setProducts((prev) =>
        pageNum === 1 ? prodRes.data : [...prev, ...newUnique]
      );
      setHasMore(prodRes.data.length >= PRODUCTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching category/products:", err);
      if (pageNum === 1) setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // --- Load on slug change ---
  useEffect(() => {
    if (!slug) return;
    setInitialLoading(true);
    setProducts([]);
    setPage(1);
    fetchCategoryAndProducts(1);
  }, [slug]);

  // --- Load more products ---
  useEffect(() => {
    if (page === 1) return;
    fetchCategoryAndProducts(page);
  }, [page]);

  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage((prev) => prev + 1);
  };

  const truncate = (str) =>
    str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`;

  const Price = ({ value }) => {
    const price = parseFloat(value || 0).toFixed(2);
    const [integer, decimal] = price.split(".");
    return (
      <span className="pc-price">
        <span className="pc-price-int">{integer}</span>
        <span className="pc-price-dec">.{decimal}</span>
      </span>
    );
  };

  const flyToCart = (e, imgSrc) => {
    if (!cartIconRef.current) return;
    const cartRect = cartIconRef.current.getBoundingClientRect();
    const startRect = e.currentTarget.getBoundingClientRect();

    const clone = document.createElement("img");
    clone.src = imgSrc || PlaceHolderIcon;
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

  return (
    <div className="pc-wrapper" style={{ minHeight: "40vh" }}>
      <div className="pc-category-header">
        <h2 className="pc-category-title">
          {initialLoading ? (
            <div className="pc-title-skeleton shimmer" />
          ) : category ? (
            decodeHTML(category.name)
          ) : (
            "Category Not Found"
          )}
        </h2>
      </div>

      <div className="pc-products-container">
        {initialLoading ? (
          <div className="pc-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="pc-card-skeleton">
                <div className="skeleton-img shimmer" />
                <div className="skeleton-text shimmer" />
                <div className="skeleton-price shimmer" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="pc-no-products">
            No products found in this category.
          </div>
        ) : (
          <>
            <div className="pc-grid">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="pc-card"
                  onClick={() => navigate(`/product/${p.slug}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={p.images?.[0]?.src || PlaceHolderIcon}
                    alt={decodeHTML(p.name)}
                    className="pc-card-image"
                    loading="lazy"
                  />
                  <h3 className="pc-card-title">{truncate(decodeHTML(p.name))}</h3>
                  <div style={{ padding: "0 5px" }}>
                    <ProductCardReviews
                      productId={p.id}
                      soldCount={p.total_sales || 0}
                    />
                  </div>
                  <div className="pc-card-divider" />
                  <div
                    className="pc-card-footer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src={IconAED} alt="AED" className="pc-aed-icon" />
                    <Price value={p.price} />
                    <button
                      className={`pc-add-btn ${
                        cartItems.some((item) => item.id === p.id) ? "pc-added" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        flyToCart(e, p.images?.[0]?.src);
                        addToCart(p, true);
                      }}
                    >
                      <img
                        src={
                          cartItems.some((item) => item.id === p.id)
                            ? AddedToCartIcon
                            : AddCartIcon
                        }
                        alt="Add to cart"
                        className="pc-add-icon"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="pc-load-more-wrapper">
                <button
                  className="pc-load-more-btn"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div id="pc-cart-icon" ref={cartIconRef} />
      <MiniCart />
    </div>
  );
};

export default Category;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import MiniCart from "../components/MiniCart";
import AddCartIcon from "../assets/images/addtocart.png";
import AddedToCartIcon from "../assets/images/added-cart.png";
import IconAED from "../assets/images/Dirham 2.png";
import "../assets/styles/category.css";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";
const PRODUCTS_PER_PAGE = 42;
const TITLE_LIMIT = 35;

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const ProductCategory = () => {
  const { id } = useParams();
  const categoryId = Number(id);
  const { addToCart, cartItems } = useCart();
  const [categoryName, setCategoryName] = useState("");
  const [childCategoryIds, setChildCategoryIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const cartIconRef = useRef(null);

  // Fetch category info + products together
  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryData = async () => {
      setInitialLoading(true);
      try {
        const [catRes, allCatsRes] = await Promise.all([
          fetch(
            `${API_BASE}/products/categories/${categoryId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
          ),
          fetch(
            `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100`
          ),
        ]);

        const cat = await catRes.json();
        const allCats = await allCatsRes.json();
        setCategoryName(decodeHTML(cat.name));

        const children = allCats
          .filter((c) => c.parent === categoryId)
          .map((c) => c.id);

        const ids = [categoryId, ...children];
        setChildCategoryIds(ids);
        setPage(1);

        // Fetch first products immediately
        const categoryQuery = ids.join(",");
        const url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&category=${categoryQuery}&per_page=${PRODUCTS_PER_PAGE}&page=1&orderby=date&order=desc`;
        const productRes = await fetch(url);
        const data = await productRes.json();
        setProducts(data);
        setHasMore(data.length >= PRODUCTS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching category info:", err);
        setProducts([]);
        setHasMore(false);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  // Pagination products
  useEffect(() => {
    if (!childCategoryIds.length || page === 1) return;
    const fetchMoreProducts = async () => {
      setLoading(true);
      try {
        const categoryQuery = childCategoryIds.join(",");
        const url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&category=${categoryQuery}&per_page=${PRODUCTS_PER_PAGE}&page=${page}&orderby=date&order=desc`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts((prev) => [...prev, ...data]);
        setHasMore(data.length >= PRODUCTS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoreProducts();
  }, [page, childCategoryIds]);

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
      <span className="price">
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>{integer}</span>
        <span style={{ fontSize: "12px" }}>.{decimal}</span>
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

  return (
    <div className="pcus-wrapper3" style={{ minHeight: "40vh" }}>
      <h2 className="category-page-title">{categoryName}</h2>
      <div className="pcus-categories-products1">
        {initialLoading ? (
          <div className="pcus-prd-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="pcus-prd-card pcus-skeleton">
                <div className="skeleton-img shimmer" />
                <div className="skeleton-text shimmer" />
                <div className="skeleton-price shimmer" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              minHeight: "300px",
              textAlign: "center",
              paddingTop: "40px",
              fontSize: "18px",
              color: "#666",
            }}
          >
            No products found in this category.
          </div>
        ) : (
          <>
            <div className="pcus-prd-grid">
              {products.map((p) => (
                <div key={p.id} className="pcus-prd-card">
                  <img
                    src={p.images?.[0]?.src || ""}
                    alt={decodeHTML(p.name)}
                    className="pcus-prd-image1 primary-img"
                  />
                  <h3 className="pcus-prd-title1">
                    {truncate(decodeHTML(p.name))}
                  </h3>
                  <div className="pcus-prd-price-cart1">
                    <img
                      src={IconAED}
                      alt="AED"
                      style={{
                        width: "auto",
                        height: "12px",
                        verticalAlign: "middle",
                      }}
                    />
                    <Price value={p.price} />
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
                    >
                      <img
                        src={
                          cartItems.some((item) => item.id === p.id)
                            ? AddedToCartIcon
                            : AddCartIcon
                        }
                        alt="Add to cart"
                        className="pcus-prd-add-cart-icon-img"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <button
                  className="pcus-load-more-btn"
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
      <div
        id="cart-icon"
        ref={cartIconRef}
        style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}
      />
      <MiniCart />
    </div>
  );
};

export default ProductCategory;

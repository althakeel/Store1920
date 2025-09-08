import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import MiniCart from "../components/MiniCart";
import AddCartIcon from "../assets/images/addtocart.png";
import AddedToCartIcon from "../assets/images/added-cart.png";
import IconAED from "../assets/images/Dirham 2.png";
import "../assets/styles/categorypageid.css";
import ProductCardReviews from "../components/temp/productcardreviews";
import PlaceHolderIcon from "../assets/images/common/Placeholder.png";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";
const PRODUCTS_PER_PAGE = 42;
const TITLE_LIMIT = 25;

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const ProductCategory = () => {
  const { parentSlug, slug, id } = useParams();
  const { addToCart, cartItems } = useCart();
  const [category, setCategory] = useState(null);
  const [childCategoryIds, setChildCategoryIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const cartIconRef = useRef(null);
  const navigate = useNavigate();

  // --- Fetch category + products fast ---
  useEffect(() => {
    if (!slug && !id) return;

    const fetchCategory = async () => {
      setInitialLoading(true);
      try {
        let matchedCategory;

        // ✅ 1. Fetch category directly by id or slug
        if (id) {
          const res = await fetch(
            `${API_BASE}/products/categories/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
          );
          matchedCategory = await res.json();
        } else {
          const res = await fetch(
            `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&slug=${slug}`
          );
          const data = await res.json();
          matchedCategory = data.find(
            (c) =>
              !parentSlug ||
              (parentSlug &&
                c.parent &&
                c.parent.toString() === parentSlug.toString())
          );
        }

        if (!matchedCategory) {
          setCategory(null);
          setProducts([]);
          setInitialLoading(false);
          return;
        }

        setCategory(matchedCategory);

        // ✅ 2. Fetch children + products in parallel
        const [childrenRes, productsRes] = await Promise.all([
          fetch(
            `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&parent=${matchedCategory.id}`
          ),
          fetch(
            `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&category=${matchedCategory.id}&per_page=${PRODUCTS_PER_PAGE}&page=1&orderby=date&order=desc&_fields=id,name,slug,images,price,total_sales`
          ),
        ]);

        const children = await childrenRes.json();
        const productsData = await productsRes.json();

        const ids = [matchedCategory.id, ...children.map((c) => c.id)];
        setChildCategoryIds(ids);
        setProducts(productsData);
        setHasMore(productsData.length >= PRODUCTS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching category or products:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategory();
  }, [slug, parentSlug, id]);

  // --- Pagination ---
  useEffect(() => {
    if (!childCategoryIds.length || page === 1) return;

    const fetchMoreProducts = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&category=${childCategoryIds.join(
          ","
        )}&per_page=${PRODUCTS_PER_PAGE}&page=${page}&orderby=date&order=desc&_fields=id,name,slug,images,price,total_sales`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts((prev) => [...prev, ...data]);
        setHasMore(data.length >= PRODUCTS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching more products:", err);
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
    clone.src = imgSrc || PlaceHolderIcon; // ✅ fallback for missing image
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
<h2 className="pc-category-title">
  {initialLoading ? (
  <div className="pc-title-skeleton shimmer" />
) : category ? (
  decodeHTML(category.name)
) : (
  "Category Not Found"
)}
</h2>
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
          <div className="pc-no-products">No products found in this category.</div>
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

export default ProductCategory;

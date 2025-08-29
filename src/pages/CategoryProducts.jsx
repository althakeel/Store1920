import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import MiniCart from "../components/MiniCart";
import AddCartIcon from "../assets/images/addtocart.png";
import AddedToCartIcon from "../assets/images/added-cart.png";
import IconAED from "../assets/images/Dirham 2.png";
import "../assets/styles/Category.css";
import ProductCardReviews from "../components/temp/productcardreviews";
import FilterButton from "../components/sub/FilterButton";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";
const PRODUCTS_PER_PAGE = 42;
const TITLE_LIMIT = 22;

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const UniqueProductCategory = () => {
  const { id } = useParams();
  const categoryId = Number(id);
  const { addToCart, cartItems } = useCart();

  const [categoryName, setCategoryName] = useState("");
  const [childCategoryIds, setChildCategoryIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const cartIconRef = useRef(null);

  // Fetch category info
  useEffect(() => {
    if (!categoryId) return;
    const fetchCategoryInfo = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/products/categories/${categoryId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
        );
        const cat = await res.json();
        setCategoryName(decodeHTML(cat.name));

        const allRes = await fetch(
          `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100`
        );
        const allCats = await allRes.json();
        const children = allCats.filter((c) => c.parent === categoryId).map((c) => c.id);
        setChildCategoryIds([categoryId, ...children]);
        setPage(1);
        setProducts([]);
      } catch (err) {
        console.error("Error fetching category info:", err);
      }
    };
    fetchCategoryInfo();
  }, [categoryId]);

  // Fetch products
  useEffect(() => {
    if (!childCategoryIds.length) return;

    const cacheKey = `unique_category_${categoryId}_page_${page}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      setProducts((prev) => (page === 1 ? data : [...prev, ...data]));
      setHasMore(data.length >= PRODUCTS_PER_PAGE);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryQuery = childCategoryIds.join(",");
        const url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&category=${categoryQuery}&per_page=${PRODUCTS_PER_PAGE}&page=${page}&orderby=date&order=desc&fields=id,name,images,price,total_sales`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts((prev) => (page === 1 ? data : [...prev, ...data]));
        setHasMore(data.length >= PRODUCTS_PER_PAGE);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [childCategoryIds, page, categoryId]);

  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage((prev) => prev + 1);
  };

  const truncate = (str) => (str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`);

  const Price = ({ value }) => {
    const price = parseFloat(value || 0).toFixed(2);
    const [integer, decimal] = price.split(".");
    return (
      <span className="upc-price">
        <span>{integer}</span>
        <span>.{decimal}</span>
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
    <div className="upc-wrapper">
      <div className="upc-header">
        <h2 className="upc-title">{categoryName}</h2>
        <FilterButton />
      </div>

      <div className="upc-products">
        {loading && !products.length ? (
          <div className="upc-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="upc-card-skeleton" />
            ))}
          </div>
        ) : !products.length ? (
          <div className="upc-no-products">No products found in this category.</div>
        ) : (
          <>
            <div className="upc-grid">
              {products.map((p) => {
                const mainImage = p.images?.[0]?.src || "";
                const hoverImage = p.images?.[1]?.src || mainImage;

                return (
                  <div
                    key={p.id}
                    className="upc-card"
                    onMouseEnter={() => setHoveredProduct(p.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <img
                      src={hoveredProduct === p.id ? hoverImage : mainImage}
                      alt={decodeHTML(p.name)}
                      className="upc-card-image"
                      loading="lazy"
                    />
                    <div className="upc-card-info">
                      <h3 className="upc-card-title">{truncate(decodeHTML(p.name))}</h3>
                      <div className="upc-card-divider" />
                      <ProductCardReviews productId={p.id} soldCount={p.total_sales || 0} />
                    </div>
                    <div className="upc-card-footer">
                      <div className="upc-price-wrapper">
                        <img src={IconAED} alt="AED" className="upc-aed-icon" />
                        <Price value={p.price} />
                      </div>
                      <button
                        className={`upc-add-btn ${
                          cartItems.some((item) => item.id === p.id) ? "upc-added" : ""
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
                          className="upc-add-icon"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="upc-load-more-wrapper">
                <button className="upc-load-more-btn" onClick={loadMore}>
                  {loading ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div id="upc-cart-icon" ref={cartIconRef} />
      <MiniCart />
    </div>
  );
};

export default UniqueProductCategory;

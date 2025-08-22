// CategoryPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import MiniCart from "../components/MiniCart";
import FilterButton from "../components/sub/FilterButton";
import ProductCardReviews from "../components/temp/productcardreviews";
import DirhamIcon from "../assets/images/Dirham 2.png";
import AddCartIcon from "../assets/images/addtocart.png";
import AddedToCartIcon from "../assets/images/added-cart.png";
import '../assets/styles/singlecategorypage.css'

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_be7e3163c85f7be7ca616ab4d660d65117ae5ac5";
const CONSUMER_SECRET = "cs_df731e48bf402020856ff21400c53503d545ac35";
const PRODUCTS_PER_PAGE = 50;
const MAX_PRODUCTS = 10000;
const TITLE_LIMIT = 35;

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const SkeletonCard = () => (
  <div className="catepage-skeleton">
    <div className="catepage-skeleton-img" />
    <div className="catepage-skeleton-info">
      <div style={{ height: 18, width: "80%", background: "#ddd" }} />
      <div style={{ height: 14, width: "50%", background: "#eee" }} />
      <div style={{ height: 32, width: "100%", background: "#ddd", marginTop: 8 }} />
    </div>
  </div>
);

const badgeLabelMap = {
  best_seller: "Best Seller",
  recommended: "Recommended",
};

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState("د.إ"); // default Dirham
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    sortBy: null,
    selectedBadges: [],
  });

  // Track which products have been added to cart
  const [addedProducts, setAddedProducts] = useState({}); // { [productId]: true }

  // Fetch currency
  useEffect(() => {
    async function fetchCurrency() {
      try {
        const res = await fetch(
          `${API_BASE}/settings/general?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
        );
        const data = await res.json();
        const currencyCode =
          data.find((item) => item.id === "woocommerce_currency")?.value || "AED";
        const map = { USD: "$", EUR: "€", GBP: "£", AED: "د.إ", INR: "₹" };
        setCurrencySymbol(map[currencyCode] || "د.إ");
      } catch (e) {
        console.error(e);
      }
    }
    fetchCurrency();
  }, []);

  // Fetch category name
  useEffect(() => {
    if (!id) return;
    async function fetchCategoryName() {
      try {
        const res = await fetch(
          `${API_BASE}/products/categories/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
        );
        const data = await res.json();
        setCategoryName(data.name || `Category ${id}`);
      } catch (e) {
        console.error(e);
        setCategoryName(`Category ${id}`);
      }
    }
    fetchCategoryName();
  }, [id]);

  // Build query params
  const buildQueryParams = (pageNum, filters) => {
    const params = new URLSearchParams();
    params.append("consumer_key", CONSUMER_KEY);
    params.append("consumer_secret", CONSUMER_SECRET);
    params.append("per_page", PRODUCTS_PER_PAGE);
    params.append("page", pageNum);
    params.append("category", id);

    let orderby = "date";
    let order = "desc";

    if (filters) {
      if (filters.priceMin) params.append("min_price", filters.priceMin);
      if (filters.priceMax) params.append("max_price", filters.priceMax);

      switch (filters.sortBy) {
        case "price_asc":
          orderby = "price";
          order = "asc";
          break;
        case "price_desc":
          orderby = "price";
          order = "desc";
          break;
        case "newest":
          orderby = "date";
          order = "desc";
          break;
        case "popularity":
          orderby = "popularity";
          order = "desc";
          break;
      }
    }

    params.append("orderby", orderby);
    params.append("order", order);
    return params.toString();
  };
const fetchProducts = useCallback(
  async (pageNum = 1, appliedFilters = null, replace = false) => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams(pageNum, appliedFilters);
      const url = `${API_BASE}/products?${queryParams}`;
      const res = await fetch(url);
      const data = await res.json();

      // Ensure data is always an array
      const safeData = Array.isArray(data) ? data : [];

      if (replace) setProducts(safeData);
      else setProducts((prev) => [...prev, ...safeData]);

      if (safeData.length < PRODUCTS_PER_PAGE || pageNum * PRODUCTS_PER_PAGE >= MAX_PRODUCTS) {
        setHasMore(false);
      } else setHasMore(true);
    } catch (e) {
      console.error(e);
      setHasMore(false);
      setProducts([]); // fallback empty array
    } finally {
      setLoading(false);
    }
  },
  [id]
);


  // Refetch when category or filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    if (id) fetchProducts(1, filters, true);
  }, [id, filters, fetchProducts]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, filters);
  };

  const truncate = (str) => (str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`);

  const renderStars = (ratingStr) => {
    const rating = Math.round(parseFloat(ratingStr)) || 0;
    return (
      <span className="catepage-stars" aria-label={`Rating: ${rating} out of 5`}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "catepage-star filled" : "catepage-star"}>
            ★
          </span>
        ))}
      </span>
    );
  };

  const handleAddToCart = (productId, product) => {
    addToCart(product);
    setAddedProducts((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [productId]: false }));
    }, 1500);
  };

  return (
    <div className="catepage-wrapper">
      {/* Category Title */}

      {/* Filter Section */}
      <div className="catepage-filter-wrapper">
  <h2 className="catepage-main-title">{decodeHTML(categoryName)} Products</h2>
  <FilterButton
    onFilterChange={(newFilters) =>
      setFilters((prev) => ({ ...prev, ...newFilters }))
    }
  />
</div>

      {/* Product Grid */}
      <div className="catepage-prod-grid">
       {products.length === 0 && !loading ? (
  <div className="catepage-no-products">
    No products found
  </div>
) : (
          <>
            {products.map((p) => {
              const onSale = p.price !== p.regular_price;
              const badges = p.best_seller_recommended_badges || [];

              return (
                <div key={p.id} className="catepage-prod-card" onClick={() => navigate(`/product/${p.slug}`)}>
                  <div className="catepage-prod-img-wrapper">
                    <img src={p.images?.[0]?.src || ""} alt={decodeHTML(p.name)} className="catepage-prod-img" />
                    {badges.length > 0 && (
                      <div className="catepage-badges-wrapper">
                        {badges.map((badge, i) => (
                          <span key={i} className={`catepage-badge badge-${badge}`}>
                            {badgeLabelMap[badge] || badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="catepage-prod-info">
                    <h3 className="catepage-prod-title">{truncate(decodeHTML(p.name))}</h3>
                    <ProductCardReviews />
                    <div className="catepage-prod-price-cart">
  <span className="catepage-prod-sale-price">
    <img src={DirhamIcon} alt="Dirham" style={{ width: 14, marginRight: 2 }} />
    {(() => {
      const [intPart, decPart] = p.price.includes(".") ? p.price.split(".") : [p.price, "00"];
      return (
        <>
          <span className="price-int">{intPart}</span>
          <span className="price-dec">.{decPart}</span>
        </>
      );
    })()}
  </span>

  {/* Show regular price only if it exists and is greater than 0 */}
  {p.regular_price && parseFloat(p.regular_price) > 0 && p.regular_price !== p.price && (
    <span className="catepage-prod-regular-price">
      <img src={DirhamIcon} alt="Dirham" style={{ width: 10, marginRight: 2 }} />
      {(() => {
        const [intPart, decPart] = p.regular_price.includes(".") ? p.regular_price.split(".") : [p.regular_price, "00"];
        return (
          <>
            <span className="price-int-regular">{intPart}</span>
            <span className="price-dec-regular">.{decPart}</span>
          </>
        );
      })()}
    </span>
  )}

  <button
    className="catepage-add-cart-btn"
    onClick={(e) => {
      e.stopPropagation();
      handleAddToCart(p.id, p);
    }}
  >
    <img
      src={addedProducts[p.id] ? AddedToCartIcon : AddCartIcon}
      alt={addedProducts[p.id] ? "Added" : "Add to cart"}
      style={{ width: 20, height: 20 }}
    />
  </button>
</div>

                  </div>
                </div>
              );
            })}
            {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </>
        )}
      </div>

      {hasMore && products.length > 0 && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button className="catepage-loadmore-btn" onClick={loadMore} disabled={loading}>
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}

      <MiniCart />
    </div>
  );
};

export default CategoryPage;

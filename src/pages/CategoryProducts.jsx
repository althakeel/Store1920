import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { throttle } from "lodash";
import AddCarticon from "../assets/images/addtocart.png";
import AddedToCartIcon from "../assets/images/added-cart.png";
import IconAED from "../assets/images/Dirham 2.png";
import ProductCardReviews from "../components/temp/productcardreviews";
import "../assets/styles/CategoryProducts.css";

const TITLE_LIMIT = 35;
const PER_PAGE = 20;
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

const truncate = (str) => (str.length <= TITLE_LIMIT ? str : `${str.slice(0, TITLE_LIMIT)}…`);

const CategoryProducts = () => {
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [products, setProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const categoriesRef = useRef(null);
  const cartIconRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/categories`, {
        auth: AUTH,
        params: { per_page: 100 },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Convert slug to ID
  useEffect(() => {
    if (categories.length && slug) {
      const cat = categories.find((c) => c.slug === slug);
      setSelectedCategoryId(cat ? cat.id : "all");
    }
  }, [slug, categories]);

  // Fetch products
  const fetchProducts = useCallback(
    async (categoryId = selectedCategoryId, page = 1) => {
      setLoadingProducts(true);
      try {
        let categoryIds = [];

        if (categoryId !== "all") {
          const getAllChildIds = (id) => {
            const children = categories.filter((c) => c.parent === id);
            return [id, ...children.flatMap((c) => getAllChildIds(c.id))];
          };
          categoryIds = getAllChildIds(categoryId);
        }

        const params = { per_page: PER_PAGE, page };
        if (categoryIds.length) params.category = categoryIds.join(",");

        const res = await axios.get(`${API_BASE}/products`, { auth: AUTH, params });

        if (page === 1) setProducts(res.data);
        else setProducts((prev) => [...prev, ...res.data]);

        setHasMoreProducts(res.data.length === PER_PAGE);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoadingProducts(false);
      }
    },
    [categories, selectedCategoryId]
  );

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products on category change
  useEffect(() => {
    if (selectedCategoryId) {
      setProductsPage(1);
      setHasMoreProducts(true);
      fetchProducts(selectedCategoryId, 1);
    }
  }, [selectedCategoryId, fetchProducts]);

  // Load more handler
  const loadMoreProducts = () => {
    const nextPage = productsPage + 1;
    setProductsPage(nextPage);
    fetchProducts(selectedCategoryId, nextPage);
  };

  // Fly-to-cart animation
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

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  // Handle product click
  const onProductClick = (slug, id) => {
    const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
    const updatedRecent = [id, ...recent.filter((rid) => rid !== id)].slice(0, 5);
    localStorage.setItem("recentProducts", JSON.stringify(updatedRecent));
    window.open(`/product/${slug}`, "_blank", "noopener,noreferrer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll arrows
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

  return (
    <div className="pcus-wrapper3">
      {/* Products Grid */}
      <div className="pcus-prd-grid">
        {loadingProducts
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pcus-prd-skeleton" />
            ))
          : products.map((p) => {
              const onSale = p.sale_price && p.sale_price !== p.regular_price;
              return (
                <div
                  key={p.id}
                  className="pcus-prd-card"
                  onClick={() => onProductClick(p.slug, p.id)}
                >
                  <div className="pcus-image-wrapper1">
                    <img
                      src={p.images?.[0]?.src || ""}
                      alt={decodeHTML(p.name)}
                      className="pcus-prd-image1 primary-img"
                    />
                    {p.images?.[1] && (
                      <img
                        src={p.images[1].src}
                        alt={decodeHTML(p.name)}
                        className="pcus-prd-image1 secondary-img"
                      />
                    )}
                  </div>
                  <div className="pcus-prd-info1">
                    <h3 className="pcus-prd-title1">{truncate(decodeHTML(p.name))}</h3>
                    <ProductCardReviews
                      reviews={p.reviews_count || 0}
                      rating={p.average_rating || 0}
                      sold={p.total_sales || 0}
                    />
                    <div className="pcus-prd-price-cart1">
                      <div className="pcus-prd-prices1">
                        <img src={IconAED} alt="AED" style={{ width: "auto", height: "13px", marginRight: 2 }} />
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
                        className={`pcus-prd-add-cart-btn ${
                          cartItems.some((item) => item.id === p.id) ? "added-to-cart" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          flyToCart(e, p.images?.[0]?.src);
                          addToCart(p);
                        }}
                      >
                        <img
                          src={cartItems.some((item) => item.id === p.id) ? AddedToCartIcon : AddCarticon}
                          alt={cartItems.some((item) => item.id === p.id) ? "Added to cart" : "Add to cart"}
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
          <button onClick={loadMoreProducts} className="load-more-btn">
            Load More
          </button>
        </div>
      )}

      <div ref={cartIconRef} style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }} />
    </div>
  );
};

export default CategoryProducts;

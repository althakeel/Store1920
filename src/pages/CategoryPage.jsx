import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const fetchCategoryAndProducts = useCallback(async (pageNum = 1) => {
    if (!slug) return;
    setLoading(true);

    try {
      let cat = null;
      
      console.log('🔍 Starting fetch for slug:', slug, 'page:', pageNum);
      
      // 1️⃣ Try custom endpoint first 
      try {
        const customUrl = `https://db.store1920.com/wp-json/store1920/v1/category/${slug}`;
        console.log('🌐 Trying custom endpoint:', customUrl);
        
        const catRes = await axios.get(customUrl);
        console.log('✅ Custom endpoint response:', catRes.data);
        
        if (catRes.data && !catRes.data.code && catRes.data.id) {
          cat = catRes.data;
          console.log('✅ Found category via custom endpoint:', cat);
        } else {
          console.log('❌ Custom endpoint returned invalid data:', catRes.data);
        }
      } catch (customError) {
        console.log('❌ Custom endpoint failed:', customError.message);
        console.log('❌ Error response:', customError.response?.data);
      }
      
      // 2️⃣ Fallback to standard WooCommerce API
      if (!cat) {
        console.log('🔄 Trying standard WooCommerce API as fallback');
        
        const standardUrl = `${API_BASE}/products/categories`;
        console.log('🌐 Standard API URL:', standardUrl, 'with slug:', slug);
        
        const catRes = await axios.get(standardUrl, {
          params: {
            slug,
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
          },
        });
        
        console.log('📦 Standard API response:', catRes.data);
        
        if (catRes.data.length > 0) {
          cat = catRes.data[0];
          console.log('✅ Found category via standard API:', cat);
        } else {
          console.log('❌ No category found in standard API for slug:', slug);
          
          // 3️⃣ Try some known category mappings based on your data
          const knownCategories = {
            'automotive-motorcycle': { id: 6531, name: 'Automotive & Motorcycle', slug: 'automotive-motorcycle' },
            'accessories': { id: 6525, name: 'Accessories', slug: 'accessories' },
            'beauty-personal-care': { id: 6526, name: 'Beauty & Personal Care', slug: 'beauty-personal-care' },
            'electronics-smart-devices': { id: 498, name: 'Electronics & Smart Devices', slug: 'electronics-smart-devices' },
            'furniture-home-living': { id: 6521, name: 'Furniture & Home Living', slug: 'furniture-home-living' },
            'home-appliances': { id: 6519, name: 'Home Appliances', slug: 'home-appliances' },
            'mens-clothing': { id: 6522, name: "Men's Clothing", slug: 'mens-clothing' },
            'womens-clothing': { id: 6523, name: "Women's Clothing", slug: 'womens-clothing' },
            'pet-supplies': { id: 6533, name: 'Pet Supplies', slug: 'pet-supplies' },
            'sports-outdoors-hobbies': { id: 6530, name: 'Sports, Outdoors & Hobbies', slug: 'sports-outdoors-hobbies' }
          };
          
          if (knownCategories[slug]) {
            console.log('🎯 Using hardcoded category mapping for:', slug);
            cat = knownCategories[slug];
            console.log('✅ Found category via hardcoded mapping:', cat);
          } else {
            // Try to get all categories for debugging
            console.log('� Fetching all categories to debug...');
            try {
              const allCatsRes = await axios.get(standardUrl, {
                params: {
                  per_page: 50,
                  consumer_key: CONSUMER_KEY,
                  consumer_secret: CONSUMER_SECRET,
                },
              });
              console.log('� First 50 available categories:', allCatsRes.data.map(c => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                count: c.count
              })));
              
              // Try to find a similar slug
              const similarCategory = allCatsRes.data.find(c => 
                c.slug.includes(slug) || slug.includes(c.slug)
              );
              
              if (similarCategory) {
                console.log('� Found similar category:', similarCategory);
                cat = similarCategory;
              }
              
            } catch (debugError) {
              console.log('❌ Could not fetch all categories:', debugError.message);
            }
          }
        }
      }

      if (!cat) {
        console.log('❌ No category found for slug:', slug);
        setCategory({ id: null, name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) });
        setProducts([]);
        setHasMore(false);
        setInitialLoading(false);
        return;
      }

      console.log('🎯 Using category:', cat);
      setCategory(cat);

      // 4️⃣ Fetch products by category ID
      const productsUrl = `${API_BASE}/products`;
      const productsParams = {
        category: cat.id,
        per_page: PRODUCTS_PER_PAGE,
        page: pageNum,
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      };
      
      console.log('🛍️ Fetching products:', productsUrl, productsParams);
      
      const prodRes = await axios.get(productsUrl, { params: productsParams });

      console.log('📦 Products response:', prodRes.data);
      console.log('📊 Products count:', prodRes.data.length);

      if (prodRes.data.length === 0 && pageNum === 1) {
        console.log('⚠️ No products found for category ID:', cat.id);
        // Try fetching without category filter to see if API is working
        try {
          const testRes = await axios.get(productsUrl, {
            params: {
              per_page: 5,
              consumer_key: CONSUMER_KEY,
              consumer_secret: CONSUMER_SECRET,
            }
          });
          console.log('🧪 Test API call (all products, first 5):', testRes.data.length, 'products found');
        } catch (testError) {
          console.log('🧪 Test API call failed:', testError.message);
        }
      }

      // Set products with functional update
      setProducts((prevProducts) => {
        if (pageNum === 1) {
          console.log('🔄 Setting initial products:', prodRes.data.length);
          return prodRes.data;
        } else {
          const newUnique = prodRes.data.filter(
            (p) => !prevProducts.some((existing) => existing.id === p.id)
          );
          console.log('➕ Adding', newUnique.length, 'new products to existing', prevProducts.length);
          return [...prevProducts, ...newUnique];
        }
      });

      setHasMore(prodRes.data.length >= PRODUCTS_PER_PAGE);
      console.log('✅ Fetch completed successfully');
      
    } catch (err) {
      console.error("❌ Error fetching category/products:", err);
      console.error("❌ Error details:", err.response?.data || err.message);
      if (pageNum === 1) setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [slug]);

  // --- Load on slug change ---
  useEffect(() => {
    if (!slug) return;
    setInitialLoading(true);
    setProducts([]);
    setPage(1);
    fetchCategoryAndProducts(1);
  }, [slug, fetchCategoryAndProducts]);

  // --- Load more products ---
  useEffect(() => {
    if (page === 1) return;
    fetchCategoryAndProducts(page);
  }, [page, fetchCategoryAndProducts]);

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
      
      {/* Most Deals Section */}
      <MostDealsSection />
    </div>
  );
};

// Most Deals Section Component
const MostDealsSection = () => {
  const [dealsProducts, setDealsProducts] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const cartIconRef = useRef(null);

  useEffect(() => {
    fetchMostDeals();
  }, []);

  const fetchMostDeals = async () => {
    try {
      setDealsLoading(true);
      // Fetch products with high sales or featured products
      const response = await axios.get(`${API_BASE}/products`, {
        params: {
          per_page: 12,
          orderby: 'popularity', // or 'rating' or 'menu_order'
          order: 'desc',
          featured: true, // Get featured products
          consumer_key: CONSUMER_KEY,
          consumer_secret: CONSUMER_SECRET,
        },
      });
      
      console.log('🎯 Most Deals products:', response.data);
      setDealsProducts(response.data);
    } catch (error) {
      console.error('❌ Error fetching deals:', error);
      // Fallback: fetch any products
      try {
        const fallbackResponse = await axios.get(`${API_BASE}/products`, {
          params: {
            per_page: 12,
            orderby: 'date',
            order: 'desc',
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
          },
        });
        setDealsProducts(fallbackResponse.data);
      } catch (fallbackError) {
        console.error('❌ Fallback deals fetch failed:', fallbackError);
      }
    } finally {
      setDealsLoading(false);
    }
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

  if (dealsLoading) {
    return (
      <div className="pc-deals-section" style={{ marginTop: "40px", padding: "20px 0" }}>
        <h2 className="pc-deals-title" style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px", fontWeight: "bold" }}>
          🔥 Most Deals
        </h2>
        <div className="pc-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="pc-card-skeleton">
              <div className="skeleton-img shimmer" />
              <div className="skeleton-text shimmer" />
              <div className="skeleton-price shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (dealsProducts.length === 0) {
    return null;
  }

  return (
    <div className="pc-deals-section" style={{ marginTop: "40px", padding: "20px 0", backgroundColor: "#f8f9fa" }}>
      <h2 className="pc-deals-title" style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px", fontWeight: "bold", color: "#e74c3c" }}>
        🔥 Most Deals
      </h2>
      <div className="pc-grid">
        {dealsProducts.map((p) => (
          <div
            key={p.id}
            className="pc-card"
            onClick={() => navigate(`/product/${p.slug}`)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {/* Deal Badge */}
            {p.featured && (
              <div style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                backgroundColor: "#e74c3c",
                color: "white",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "10px",
                fontWeight: "bold",
                zIndex: 2
              }}>
                HOT DEAL
              </div>
            )}
            
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
    </div>
  );
};

export default Category;

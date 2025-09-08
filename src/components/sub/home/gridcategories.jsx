// src/components/home/GridCategories.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/home/GridCategories.css";
import { useCart } from "../../../contexts/CartContext";

// Images
import PlaceHolderImage from "../../../assets/images/common/Placeholder.png";
import grid1 from "../../../assets/images/gridhome/1 (1).png";
import grid2 from "../../../assets/images/gridhome/2.png";
import grid3 from "../../../assets/images/gridhome/3.png";
import grid4 from "../../../assets/images/gridhome/4.png";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const AUTH = {
  username: "ck_c4e35c0d93df1f96cae81fccae967b8969a1eb85",
  password: "cs_b2b2ab3b1cdbc7db01cd718dc52b8f5a5711a6e5",
};

// Static left categories
const staticCategories = [
  { id: 1, name: "Mobiles & Tablets", image: grid2, link: "/category/6535" },
  { id: 2, name: "Automotive & Motorcycle", image: grid4, link: "/category/6531	" },
  { id: 3, name: "Fashion Deals", image: grid1, link: "/category/6522" },
  { id: 4, name: "Home & Kitchen", image: grid3, link: "/category/6519" },
];

// Initial static center grid placeholders
const initialProductPlaceholders = [
  { id: "ph1", image: 'https://db.store1920.com/wp-content/uploads/2025/09/171996-2m5ilp.jpg', name: "Loading...", price: null },
  { id: "ph2", image: 'https://db.store1920.com/wp-content/uploads/2025/09/171829-pa7trl.jpg', name: "Loading...", price: null },
  { id: "ph3", image: 'https://db.store1920.com/wp-content/uploads/2025/09/168833-oyb1ng.jpg', name: "Loading...", price: null },
  { id: "ph4", image: 'https://db.store1920.com/wp-content/uploads/2025/09/168010-gsmxtg.jpg', name: "Loading...", price: null },
];

// Countdown Hook
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        h: Math.floor(distance / (1000 * 60 * 60)),
        m: Math.floor((distance / (1000 * 60)) % 60),
        s: Math.floor((distance / 1000) % 60),
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

const GridCategories = () => {
  const [products, setProducts] = useState(initialProductPlaceholders);
  const [banners, setBanners] = useState([]);
  const [targetDate] = useState(new Date().getTime() + 24 * 60 * 60 * 1000);

  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { addToCart, cartItems } = useCart();
  const featuredCountdown = useCountdown(targetDate);
  const navigate = useNavigate();

  // Detect mobile resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide banners on mobile
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, banners.length]);

  // Fetch products (fast API first, fallback to WC products)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://db.store1920.com/wp-json/custom/v1/fast-products",
          { timeout: 2000 }
        );
        const data = Array.isArray(res.data) ? res.data.slice(0, 4) : [];
        if (data.length > 0) {
          setProducts(data);
          return;
        }
      } catch (err) {
        console.error("⚠️ Fast product fetch error:", err);
      }

      // fallback
      try {
        const res = await axios.get(`${API_BASE}/products?per_page=4`, { auth: AUTH });
        setProducts(res.data);
      } catch (err) {
        console.error("⚠️ WC product fetch error:", err);
      }
    };

    fetchProducts();
  }, []);

  // Set banners
  useEffect(() => {
    setBanners([
      {
        id: 1,
        image: "https://db.store1920.com/wp-content/uploads/2025/08/3-6.webp",
      },
      {
        id: 2,
        image: "https://db.store1920.com/wp-content/uploads/2025/08/4-4.webp",
      },
    ]);
  }, []);

  const isInCart = (id) => cartItems.some((item) => item.id === id);

  return (
    <div className="gcx-container">
      {/* LEFT - Categories */}
      <div className="gcx-left">
        <h3 className="gcx-section-title">More Reasons to Shop</h3>
        <div className="gcx-left-grid">
          {staticCategories.map((cat) => (
            <div
              key={cat.id}
              className="gcx-category-card"
              onClick={() => navigate(cat.link)}
            >
              <img
                src={cat.image || PlaceHolderImage}
                alt={cat.name}
                style={{ objectFit: "fill" }}
              />
              <div className="gcx-cat-info">
                <h4>{cat.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER - Products */}
      <div className="gcx-middle">
        <div className="gcx-featured-header">
          <h3 className="gcx-mega-title">MEGA DEALS</h3>
          <div className="gcx-featured-countdown">
            ⏳ {featuredCountdown.h}h : {featuredCountdown.m}m :{" "}
            {featuredCountdown.s}s
          </div>
        </div>

        <div className="gcx-middle-grid">
          {products.map((prod, idx) => {
            const inCart = isInCart(prod.id);
            const shortName =
              prod.name && prod.name.length > 20
                ? prod.name.substring(0, 20) + "..."
                : prod.name || "Loading...";

            return (
              <div key={prod?.id || `ph-${idx}`} className="gcx-product-card">
                <img
                  src={
                    prod?.images?.[0]?.src ||
                    prod?.image ||
                    PlaceHolderImage
                  }
                  alt={prod?.name || "Product"}
                />

                {/* Product name */}
                <h4 className="gcx-product-title">{shortName}</h4>

                {/* Price */}
                {prod?.price && (
                  <div className="gcx-price-wrap">
                    {prod?.regular_price && (
                      <span className="gcx-old-price">
                        AED {prod.regular_price}
                      </span>
                    )}
                    <span className="gcx-product-price">
                      AED {prod.price}
                    </span>
                  </div>
                )}

                {/* Add to cart button (only if real product) */}
                {prod?.id && (
                  <button
                    className="gcx-cart-btn"
                    onClick={() => !inCart && addToCart(prod)}
                  >
                    {inCart ? "Added" : "Add to Cart"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT - Banners */}
      <div className="gcx-right">
        {isMobile ? (
          <div className="gcx-banner">
            <img
              src={banners[currentBanner]?.image}
              alt={`Banner ${banners[currentBanner]?.id}`}
              style={{ transition: "opacity 0.5s ease-in-out" }}
            />
          </div>
        ) : (
          banners.map((ban) => (
            <div key={ban.id} className="gcx-banner">
              <img src={ban.image} alt={`Banner ${ban.id}`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GridCategories;

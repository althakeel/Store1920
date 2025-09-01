// src/components/home/GridCategories.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../../../assets/styles/home/GridCategories.css";
import { useCart } from "../../../contexts/CartContext";
import PlaceHolderImage from '../../../assets/images/common/Placeholder.png'
import grid1 from '../../../assets/images/gridhome/1 (1).png'
import grid2 from '../../../assets/images/gridhome/2.png'
import grid3 from '../../../assets/images/gridhome/3.png'
import grid4 from '../../../assets/images/gridhome/4.png'



const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const AUTH = {
  username: "ck_c4e35c0d93df1f96cae81fccae967b8969a1eb85",
  password: "cs_b2b2ab3b1cdbc7db01cd718dc52b8f5a5711a6e5",
};


const staticCategories = [
  {
    id: 1,
    name: "Mobiles & Tablets",
    image: grid2,
    link: "/category/mobiles",
  },
  {
    id: 2,
    name: "Laptops & Gadgets",
    image: grid4,
    link: "/category/laptops",
  },
  {
    id: 3,
    name: "Fashion Deals",
    image: grid1,
    link: "/category/fashion",
  },
  {
    id: 4,
    name: "Home & Kitchen",
    image: grid3,
    link: "/category/home-kitchen",
  },
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
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
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

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${API_BASE}/products/categories?per_page=10`, { auth: AUTH })
      .then((res) => setCategories(res.data.slice(0, 4)))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  // Fetch products
  useEffect(() => {
    axios
      .get(`${API_BASE}/products?per_page=10`, { auth: AUTH })
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch((err) => console.error("Product fetch error:", err));
  }, []);

  // Set banners
  useEffect(() => {
    setBanners([
      { id: 1, image: "https://db.store1920.com/wp-content/uploads/2025/08/3-6.webp" },
      { id: 2, image: "https://db.store1920.com/wp-content/uploads/2025/08/4-4.webp" },
    ]);
  }, []);

  const isInCart = (id) => cartItems.some((item) => item.id === id);

  return (
    <div className="gcx-container">
      {/* LEFT - Categories */}
 {/* LEFT - Static Categories */}
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
            ⏳ {featuredCountdown.h}h : {featuredCountdown.m}m : {featuredCountdown.s}s
          </div>
        </div>

        <div className="gcx-middle-grid">
          {products.map((prod) => {
            const inCart = isInCart(prod.id);
            return (
              <div key={prod?.id} className="gcx-product-card">
                <img
                  src={prod?.images?.[0]?.src || PlaceHolderImage}
                  alt={prod?.name || "Product"}
                />
                <div className="gcx-price-wrap">
                  {prod?.regular_price && (
                    <span className="gcx-old-price">AED {prod.regular_price}</span>
                  )}
                  <span className="gcx-product-price">AED {prod?.price || "N/A"}</span>
                </div>
                <button
                  className="gcx-cart-btn"
                  onClick={() => !inCart && addToCart(prod)}
                >
                  {inCart ? "Added" : "Add to Cart"}
                </button>
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

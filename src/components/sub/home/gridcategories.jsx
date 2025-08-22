// src/components/home/GridCategories.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../../../assets/styles/home/GridCategories.css";
import { useCart } from "../../../contexts/CartContext";
import MiniCart from "../../MiniCart";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const AUTH = {
  username: "ck_c4e35c0d93df1f96cae81fccae967b8969a1eb85",
  password: "cs_b2b2ab3b1cdbc7db01cd718dc52b8f5a5711a6e5",
};

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

  const { addToCart, cartItems } = useCart();
  const featuredCountdown = useCountdown(targetDate);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/products/categories?per_page=10`, { auth: AUTH })
      .then((res) => setCategories(res.data.slice(0, 4)))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE}/products?per_page=10`, { auth: AUTH })
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch((err) => console.error("Product fetch error:", err));
  }, []);

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
          {categories.slice(0, 4).map((cat, i) => (
            <div
              key={cat?.id}
              className="gcx-category-card"
              onClick={() => navigate(`/category/${cat.slug}`)} // redirect on click
            >
              <img
                src={cat?.image?.src || "https://via.placeholder.com/200"}
                alt={cat?.name || "Category"}
                style={{objectFit:'fill'}}
              />
              <div className="gcx-cat-info">
                <h4 dangerouslySetInnerHTML={{ __html: cat?.name }} />
             
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
          {products.slice(0, 4).map((prod) => {
            const inCart = isInCart(prod.id);
            return (
              <div key={prod?.id} className="gcx-product-card">
                <img
                  src={prod?.images?.[0]?.src || "https://via.placeholder.com/200"}
                  alt={prod?.name || "Product"}
                />
                <div className="gcx-price-wrap">
                  {prod?.regular_price && (
                    <span className="gcx-old-price">AED {prod.regular_price}</span>
                  )}
                  <span className="gcx-product-price">AED {prod?.price || "N/A"}</span>

                  {/* Updated Add to Cart Button */}
                  
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
        {banners.map((ban) => (
          <div key={ban.id} className="gcx-banner">
            <img src={ban.image} alt={`Banner ${ban.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridCategories;
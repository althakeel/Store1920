// src/components/home/GridCategories.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/home/GridCategories.css";
import { useCart } from "../../../contexts/CartContext";
import { getProductsByCategories } from "../../../api/woocommerce";

// Images
import PlaceHolderImage from "../../../assets/images/common/Placeholder.png";
import grid1 from "../../../assets/images/gridhome/1 (1).png";
import grid2 from "../../../assets/images/gridhome/2.png";
import grid3 from "../../../assets/images/gridhome/3.png";
import grid4 from "../../../assets/images/gridhome/4.png";

// Static left categories
const staticCategories = [
  { id: 1, name: "Mobiles & Tablets", image: grid2, link: "/category/6535" },
  { id: 2, name: "Automotive & Motorcycle", image: grid4, link: "/category/6531" },
  { id: 3, name: "Fashion Deals", image: grid1, link: "/category/6522" },
  { id: 4, name: "Home & Kitchen", image: grid3, link: "/category/6519" },
];

// Placeholder products while loading
const initialProductPlaceholders = [
  { id: "ph1", image: PlaceHolderImage, name: "Loading...", price: null },
  { id: "ph2", image: PlaceHolderImage, name: "Loading...", price: null },
  { id: "ph3", image: PlaceHolderImage, name: "Loading...", price: null },
  { id: "ph4", image: PlaceHolderImage, name: "Loading...", price: null },
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
  const [products, setProducts] = useState(initialProductPlaceholders); // Start with placeholders
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [targetDate] = useState(new Date().getTime() + 24 * 60 * 60 * 1000);

  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const featuredCountdown = useCountdown(targetDate);

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

  // Fetch max 4 products via API helper and replace placeholders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategories([6522, 6531, 6535, 6519], 1, 4); // max 4
        if (data && data.length > 0) {
          const updatedProducts = data.slice(0, 4).map((prod) => ({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            regular_price: prod.regular_price,
            images: prod.images && prod.images.length > 0 ? prod.images : [{ src: PlaceHolderImage }],
          }));
          setProducts(updatedProducts);
        }
      } catch (err) {
        console.error("Error fetching products via API helper:", err);
      }
    };
    fetchProducts();
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
      <div className="gcx-left">
        <h3 className="gcx-section-title">More Reasons to Shop</h3>
        <div className="gcx-left-grid">
          {staticCategories.map((cat) => (
            <div
              key={cat.id}
              className="gcx-category-card"
              onClick={() => navigate(cat.link)}
            >
              <img src={cat.image || PlaceHolderImage} alt={cat.name} style={{ objectFit: "fill" }} />
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
          {products.map((prod, idx) => {
            const inCart = isInCart(prod.id);
            const displayName = prod.name
              ? prod.name.length > 22
                ? prod.name.substring(0, 22) + "…"
                : prod.name
              : "Loading...";

            return (
              <div key={prod.id || `ph-${idx}`} className="gcx-product-card">
                {/* Image with fade-in effect when replaced */}
                <img
                  src={prod?.images?.[0]?.src || PlaceHolderImage}
                  alt={prod?.name || "Product"}
                  className="gcx-product-image"
                />

                {/* Product title single line with max 25 characters */}
                <h4
                  className="gcx-product-title"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {displayName}
                </h4>

                {/* Price */}
                {prod?.price && (
                  <div className="gcx-price-wrap">
                    {prod?.regular_price && (
                      <span className="gcx-old-price">AED {prod.regular_price}</span>
                    )}
                    <span className="gcx-product-price">AED {prod.price}</span>
                  </div>
                )}

                {/* Add to cart */}
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

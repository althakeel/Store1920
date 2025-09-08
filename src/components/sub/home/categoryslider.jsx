// src/components/home/CategorySlider.jsx
import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../assets/styles/CategorySlider.css";
import placeholderImg from "../../../assets/images/Skelton.png";
import { FaClock } from "react-icons/fa";

// static
import Static1 from '../../../assets/images/megamenu/Main catogory webp/Electronics & Smart Devices.webp'
import Static2 from '../../../assets/images/megamenu/Main catogory webp/Home Appliances.webp'
import Static3 from '../../../assets/images/megamenu/Main catogory webp/Home Improvement & Tools.webp'
import Static4 from '../../../assets/images/megamenu/Main catogory webp/Furniture & Home Living.webp'
import Static5 from '../../../assets/images/megamenu/Main catogory webp/MenClothing.webp'
import Static6 from '../../../assets/images/megamenu/Main catogory webp/WomenClothing.webp'
import Static7 from '../../../assets/images/megamenu/Main catogory webp/Lingerie & Loungewear.webp'
import Static8 from '../../../assets/images/megamenu/Main catogory webp/Accessories.webp'
import Static9 from '../../../assets/images/megamenu/Main catogory webp/Beauty & Personal Care.webp'
import Static10 from '../../../assets/images/megamenu/Main catogory webp/Shoes & Footwear.webp'


// WooCommerce API credentials
const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CK = "ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8";
const CS = "cs_c65538cff741bd9910071c7584b3d070609fec24";

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};


const STATIC_CATEGORIES = [
  { id: "static1", name: "Electronics & Smart Devices", image: Static1 },
  { id: "static2", name: "Home Appliances", image: Static2 },
  { id: "static3", name: "Home Improvement & Tools", image: Static3 },
  { id: "static4", name: "Furniture & Home Living", image: Static4 },
  { id: "static5", name: "Men’s Clothing", image:Static5 },
  { id: "static6", name: "Women’s Clothing", image: Static6 },
  { id: "static7", name: "Lingerie & Loungewear", image: Static7 },
  { id: "static8", name: "Accessories", image: Static8 },
  { id: "static9", name: "Beauty & Personal Care", image: Static9 },
  { id: "static10", name: "Shoes & Footwear", image: Static10 },
  
];

const CategorySlider = () => {
  const [categories, setCategories] = useState(STATIC_CATEGORIES); // show static first
  const sliderRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/categories`, {
          auth: { username: CK, password: CS },
        });

        if (!isMounted) return;

        const filtered = res.data.filter((cat) => cat.image);

        const categoriesWithDeals = filtered.map((cat) => ({
          ...cat,
          isDeal:
            cat.name.toLowerCase() === "electronics" ||
            cat.name.toLowerCase() === "fashion",
          megaSale: cat.enable_offer === true,
          dealTime: 172800,
        }));

        // Deduplicate categories by ID
        const uniqueCategories = Array.from(
          new Map(categoriesWithDeals.map((cat) => [cat.id, cat])).values()
        );

        setCategories(uniqueCategories); // replace static with fetched
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [isHomePage]);

  const settings = {
    dots: false,
    infinite: categories.length > 7,
    speed: 600,
    slidesToShow: Math.min(7, categories.length),
    slidesToScroll: 1,
    autoplay: categories.length > 0,
    autoplaySpeed: 3500,
    swipeToSlide: true,
    arrows: false,
    lazyLoad: "ondemand",
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: Math.min(7, categories.length) } },
      { breakpoint: 1280, settings: { slidesToShow: Math.min(6, categories.length) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(4, categories.length) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(3, categories.length) } },
      { breakpoint: 480, settings: { slidesToShow: Math.min(2, categories.length) } },
      { breakpoint: 375, settings: { slidesToShow: Math.min(1, categories.length) } },
    ],
  };

  const goPrev = () => sliderRef.current?.slickPrev();
  const goNext = () => sliderRef.current?.slickNext();

  return (
    <section className="category-slider-container" style={{ position: "relative" }}>
      <button className="custom-prev-arrow" onClick={goPrev}>{"<"}</button>
      <button className="custom-next-arrow" onClick={goNext}>{">"}</button>

      <Slider {...settings} ref={sliderRef}>
        {categories.map((cat) => {
          const decodedName = decodeHTML(cat.name);
          let isDragging = false;

          const handleMouseDown = () => { isDragging = false; };
          const handleMouseMove = () => { isDragging = true; };
          const handleClick = (e) => { if (isDragging) e.preventDefault(); };

          return (
            <div key={cat.id} className="category-slide" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
              <Link
                to={`/category/${cat.id}`}
                onClick={handleClick}
                className="category-link"
                style={{ textDecoration: "none", color: "#333" }}
              >
                <div style={{ position: "relative", width: "100%" }}>
                <img
  src={cat.image?.src ? cat.image.src : cat.image || placeholderImg}
  alt={decodedName}
  className="category-image"
/>

                  {cat.megaSale && <div className="mega-sale-badge">Mega Sale</div>}
                  {cat.isDeal && <ProgressBar totalDuration={cat.dealTime} />}
                </div>
                <div className="category-title">{decodedName}</div>
              </Link>
            </div>
          );
        })}
      </Slider>
    </section>
  );
};

const ProgressBar = ({ totalDuration = 172800 }) => {
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const endTimeRef = useRef(null);

  useEffect(() => {
    let storedEnd = localStorage.getItem("dealEndTime");
    if (storedEnd) {
      endTimeRef.current = parseInt(storedEnd, 10);
    } else {
      endTimeRef.current = Date.now() + totalDuration * 1000;
      localStorage.setItem("dealEndTime", endTimeRef.current);
    }

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
      setTimeLeft(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [totalDuration]);

  const percent = timeLeft > 0 ? (timeLeft / totalDuration) * 100 : 0;

  const formatTime = (secs) => {
    const days = Math.floor(secs / 86400);
    const hours = Math.floor((secs % 86400) / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className="deal-overlay">
      <div className="deal-hurry">🔥 Hurry Up!</div>
      <div className="deal-timer-text">
        <FaClock color="black" style={{ marginRight: "6px" }} /> {formatTime(timeLeft)}
      </div>
      <div className="deal-progress-bar">
        <div className="deal-progress" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default CategorySlider;

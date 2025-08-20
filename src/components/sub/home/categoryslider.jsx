import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../assets/styles/CategorySlider.css';
import placeholderImg from '../../../assets/images/Skelton.png';
import { FaClock } from 'react-icons/fa'; // black clock icon

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const CategorySlider = () => {
  const [categories, setCategories] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
  let isMounted = true;

  const loadCategories = async () => {
    // Clear old cache to avoid 1-minute timers
    localStorage.removeItem('categories');

    try {
      const res = await axios.get(`${API_BASE}/products/categories`, {
        auth: { username: CK, password: CS },
      });

      if (!isMounted) return;

      const filtered = res.data.filter((cat) => cat.image);

      const categoriesWithDeals = filtered.map((cat) => ({
        ...cat,
        isDeal: cat.name.toLowerCase() === 'electronics' || cat.name.toLowerCase() === 'fashion',
        megaSale: cat.enable_offer === true,
        dealTime: 172800, // 2 days
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
      }));

      setCategories(categoriesWithDeals);
      localStorage.setItem('categories', JSON.stringify(categoriesWithDeals));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      if (isMounted) setCategories([]);
    }
  };

  loadCategories();

  return () => { isMounted = false; };
}, []);


  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: categories && categories.length > 0,
    autoplaySpeed: 3500,
    swipeToSlide: true,
    arrows: false,
    lazyLoad: 'ondemand',
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 7 } },
      { breakpoint: 1280, settings: { slidesToShow: 6.5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
      { breakpoint: 375, settings: { slidesToShow: 1.5 } },
    ],
  };

  const goPrev = () => sliderRef.current?.slickPrev();
  const goNext = () => sliderRef.current?.slickNext();

  const renderSkeletons = (count = 8) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="category-slide skeleton-slide">
        <div className="category-skeleton-img" />
        <div className="category-skeleton-text" />
      </div>
    ));

  return (
    <section className="category-slider-container" style={{ position: 'relative' }}>
      <button className="custom-prev-arrow" onClick={goPrev}>{"<"}</button>
      <button className="custom-next-arrow" onClick={goNext}>{">"}</button>

      {categories === null ? (
        <div className="skeleton-wrapper">{renderSkeletons()}</div>
      ) : (
        <Slider {...settings} ref={sliderRef}>
          {categories.map((cat) => {
            const decodedName = decodeHTML(cat.name);
            let isDragging = false;

            const handleMouseDown = () => { isDragging = false; };
            const handleMouseMove = () => { isDragging = true; };
            const handleClick = (e) => { if (isDragging) e.preventDefault(); };

            return (
              <div
                key={cat.id}
                className="category-slide"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={handleClick}
                  className="category-link"
                  style={{ textDecoration: 'none', color: '#333' }}
                >
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img
                      src={cat.image?.src || placeholderImg}
                      alt={decodedName}
                      className="category-image"
                    />
                    {cat.megaSale && <div className="mega-sale-badge">Mega Sale</div>}
                    {cat.isDeal && <ProgressBar duration={cat.dealTime} />}
                  </div>
                  <div className="category-title">{decodedName}</div>
                </Link>
              </div>
            );
          })}
        </Slider>
      )}
    </section>
  );
};

// ✅ Countdown + progress bar with black clock
// ProgressBar with real 2-day persistent countdown
const ProgressBar = ({ totalDuration = 172800 }) => {
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const endTimeRef = useRef(null);

  useEffect(() => {
    // Save or retrieve a persistent end time from localStorage
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

    tick(); // run immediately
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

import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../assets/styles/CategorySlider.css';
import placeholderImg from '../../../assets/images/Skelton.png';

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
      const cached = localStorage.getItem('categories');
      if (cached) {
        setCategories(JSON.parse(cached));
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/products/categories`, {
          auth: {
            username: CK,
            password: CS,
          },
        });

        if (!isMounted) return;

        const filtered = res.data.filter((cat) => cat.image);
        setCategories(filtered);
        localStorage.setItem('categories', JSON.stringify(filtered));
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        if (isMounted) setCategories([]);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: Boolean(categories && categories.length > 0),
    autoplaySpeed: 3500,
    cssEase: 'ease-in-out',
    swipeToSlide: true,
    arrows: false,
    lazyLoad: 'ondemand',
    responsive: [
      { breakpoint: 2560, settings: { slidesToShow: 6.2 } },
      { breakpoint: 1536, settings: { slidesToShow: 5.5 } },
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 3.8 } },
      { breakpoint: 768, settings: { slidesToShow: 3.5 } },
      { breakpoint: 600, settings: { slidesToShow: 3.8 } },
      { breakpoint: 480, settings: { slidesToShow: 3.5 } },
      { breakpoint: 375, settings: { slidesToShow: 2.2 } },
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
    <section
      className="category-slider-container"
      role="region"
      aria-label="Category Slider"
      style={{ position: 'relative' }}
    >
      <button
        type="button"
        className="custom-prev-arrow"
        aria-label="Previous Slide"
        onClick={goPrev}
      >
        <svg
          width="29"
          height="29"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="16" y1="4" x2="8" y2="12" />
          <line x1="16" y1="20" x2="8" y2="12" />
        </svg>
      </button>

      <button
        type="button"
        className="custom-next-arrow"
        aria-label="Next Slide"
        onClick={goNext}
      >
        <svg
          width="29"
          height="29"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="8" y1="4" x2="16" y2="12" />
          <line x1="8" y1="20" x2="16" y2="12" />
        </svg>
      </button>

      {categories === null ? (
        <div className="skeleton-wrapper">{renderSkeletons()}</div>
      ) : (
        <Slider {...settings} ref={sliderRef}>
  {categories === null
    ? renderSkeletons()
    : categories.map((cat) => {
        const decodedName = decodeHTML(cat.name);
        return (
          <Link
            to={`/category/${cat.slug}`}
            key={cat.id}
            className="category-slide"
            aria-label={`View products in ${decodedName} category`}
          >
            <img
              src={cat.image.src}
              alt={decodedName}
              className="category-image"
              loading="lazy"
              decoding="async"
            />
            <p className="category-title">{decodedName}</p>
          </Link>
        );
      })}
</Slider>

      )}
    </section>
  );
};

export default CategorySlider;

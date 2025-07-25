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
    axios
      .get(`${API_BASE}/products/categories?consumer_key=${CK}&consumer_secret=${CS}`)
      .then((res) => setCategories(res.data.filter((cat) => cat.image)))
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    cssEase: 'ease-in-out',
    swipeToSlide: true,
    arrows: false, // Disable default arrows
    responsive: [
      { breakpoint: 2560, settings: { slidesToShow: 7.2 } },
      { breakpoint: 1536, settings: { slidesToShow: 6.5 } },
      { breakpoint: 1280, settings: { slidesToShow: 6 } },
      { breakpoint: 1024, settings: { slidesToShow: 3.8 } },
      { breakpoint: 768, settings: { slidesToShow: 3.5 } },
      { breakpoint: 600, settings: { slidesToShow: 3.8 } },
      { breakpoint: 480, settings: { slidesToShow: 3.5 } },
      { breakpoint: 375, settings: { slidesToShow: 2.2 } },
    ],
  };

  const handlePrev = () => {
    if (sliderRef.current) sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    if (sliderRef.current) sliderRef.current.slickNext();
  };

  const renderSkeletons = (count = 8) =>
    [...Array(count)].map((_, i) => (
      <div key={i} className="category-slide skeleton-slide" aria-hidden="true">
        <img src={placeholderImg} alt="Loading placeholder" className="category-skeleton-img" />
        <div className="category-skeleton-text" />
      </div>
    ));

  return (
    <div className="category-slider-container" role="region" aria-label="Category Slider" style={{ position: 'relative' }}>
      {/* Custom Previous Arrow */}
      <button
        type="button"
        className="custom-prev-arrow"
        aria-label="Previous Slide"
        onClick={handlePrev}
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
        >
          <line x1="16" y1="4" x2="8" y2="12" />
          <line x1="16" y1="20" x2="8" y2="12" />
        </svg>
      </button>

      {/* Custom Next Arrow */}
      <button
        type="button"
        className="custom-next-arrow"
        aria-label="Next Slide"
        onClick={handleNext}
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
        >
          <line x1="8" y1="4" x2="16" y2="12" />
          <line x1="8" y1="20" x2="16" y2="12" />
        </svg>
      </button>

      {/* The Slider */}
      <Slider {...settings} ref={sliderRef}>
        {categories === null
          ? renderSkeletons()
          : categories.map((cat) => (
              <Link
                to={`/category/${cat.slug}`}
                key={cat.id}
                className="category-slide"
                style={{ cursor: 'pointer' }}
                aria-label={`View products in ${decodeHTML(cat.name)} category`}
              >
                <img src={cat.image.src} alt={decodeHTML(cat.name)} className="category-image" />
                <p className="category-title">{decodeHTML(cat.name)}</p>
              </Link>
            ))}
      </Slider>
    </div>
  );
};

export default CategorySlider;

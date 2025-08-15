import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import placeholderImg from '../../assets/images/Skelton.png';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

// Decode HTML entities in category names
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Clear old cache for testing
    // localStorage.removeItem('categories');

    const fetchCategories = async () => {
      try {
        const cached = localStorage.getItem('categories');
        if (cached) {
          const parsed = JSON.parse(cached);
          setCategories(parsed);
          return;
        }

        const response = await axios.get(`${API_BASE}/products/categories`, {
          params: { consumer_key: CK, consumer_secret: CS },
        });

        const cats = response.data.filter((c) => c.parent === 0);
        setCategories(cats);
        localStorage.setItem('categories', JSON.stringify(cats));

        console.log('Fetched categories:', cats); // Debug log
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ overflowX: 'auto', padding: '10px', WebkitOverflowScrolling: 'touch' }}>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'nowrap',
          scrollSnapType: 'x mandatory',
        }}
      >
        {categories.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 auto',
                  width: 110,
                  height: 145,
                  background: '#eee',
                  borderRadius: 10,
                  scrollSnapAlign: 'start',
                }}
              />
            ))
          : categories.map((cat) => {
              const name = decodeHTML(cat.name);
              const imgSrc = cat.image?.src || placeholderImg;

              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  style={{
                    flex: '0 0 auto',
                    width: 110,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                    textDecoration: 'none',
                    color: '#000',
                    scrollSnapAlign: 'start',
                    display: 'block',
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={name}
                    style={{
                      width: '100%',
                      height: 90,
                      objectFit: 'cover',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      background: '#f9f9f9',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImg; // Fallback if image fails
                    }}
                  />
                  <div
                    style={{
                      padding: '6px 5px',
                      fontSize: 12,
                      fontWeight: 500,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {name}
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategorySlider;

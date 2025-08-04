import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import placeholderImg from '../../assets/images/Skelton.png';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  // Dragging and momentum refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastPos = useRef(0);
  const momentumId = useRef(null);

  useEffect(() => {
    const cached = localStorage.getItem('categories');
    if (cached) {
      setCategories(JSON.parse(cached));
      return;
    }
    axios
      .get(`${API_BASE}/products/categories`, {
        params: { consumer_key: CK, consumer_secret: CS },
      })
      .then((res) => {
        const cats = res.data.filter((c) => c.image && c.parent === 0);
        setCategories(cats);
        localStorage.setItem('categories', JSON.stringify(cats));
      })
      .catch((err) => console.error('Error:', err));
  }, []);

  // Smooth momentum animation function
  const momentumScroll = () => {
    if (!scrollRef.current) return;
    velocity.current *= 0.95; // friction

    if (Math.abs(velocity.current) > 0.5) {
      scrollRef.current.scrollLeft -= velocity.current;
      momentumId.current = requestAnimationFrame(momentumScroll);
    } else {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
  };

  // Mouse drag handlers with velocity tracking
  const onMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    lastPos.current = e.pageX;
    velocity.current = 0;
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;

    // Calculate velocity
    velocity.current = e.pageX - lastPos.current;
    lastPos.current = e.pageX;
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Start momentum scroll on release
    if (!momentumId.current) {
      momentumId.current = requestAnimationFrame(momentumScroll);
    }
  };

  const onMouseLeave = () => {
    if (isDragging.current) {
      onMouseUp();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: '10px 0',
        userSelect: isDragging.current ? 'none' : 'auto',
        cursor: isDragging.current ? 'grabbing' : 'grab',
      }}
    >
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 10,
          padding: '0 10px',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          cursor: isDragging.current ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {categories.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
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
                    src={cat.image?.src || placeholderImg}
                    alt={name}
                    style={{
                      width: '100%',
                      height: 90,
                      objectFit: 'cover',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      background: '#f9f9f9',
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

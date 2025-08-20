import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../assets/styles/Categories.css';

const API_AUTH = {
  username: 'ck_c4e35c0d93df1f96cae81fccae967b8969a1eb85',
  password: 'cs_b2b2ab3b1cdbc7db01cd718dc52b8f5a5711a6e5',
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    axios
      .get('https://db.store1920.com/wp-json/wc/v3/products/categories', { auth: API_AUTH })
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  // Fetch Brands
  useEffect(() => {
    axios
      .get('https://db.store1920.com/wp-json/wp/v2/product_brand', { auth: API_AUTH, params: { per_page: 100 } })
      .then((res) => {
        const brandNames = res.data.map((brand) => brand.name);
        setBrands(brandNames);
      })
      .catch((err) => {
        console.error('Error fetching brands:', err);
      });
  }, []);

  const decodeHTML = (str) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  const applyFilters = () => {
    let filtered = [...categories];

    if (filterOption === 'empty') {
      filtered = filtered.filter((cat) => cat.count === 0);
    }

    if (brandFilter) {
      filtered = filtered.filter((cat) =>
        cat.name.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }

    if (priceFilter === 'low') {
      filtered = filtered.filter((cat) => cat.count <= 10);
    } else if (priceFilter === 'mid') {
      filtered = filtered.filter((cat) => cat.count > 10 && cat.count <= 50);
    } else if (priceFilter === 'high') {
      filtered = filtered.filter((cat) => cat.count > 50);
    }

    if (sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'count' || sortOption === 'best') {
      filtered.sort((a, b) => b.count - a.count);
    } else if (sortOption === 'recommended') {
      filtered.sort((a, b) => a.menu_order - b.menu_order);
    }

    return filtered.slice(0, visibleCount);
  };

  const displayedCategories = applyFilters();

  const loadMore = () => setVisibleCount((prev) => prev + 25);

  const singleCategory = !loading && displayedCategories.length === 1;

  const resetFilters = () => {
    setSortOption('');
    setFilterOption('');
    setBrandFilter('');
    setPriceFilter('');
  };

  return (
    <div className="category-wrapper">
      <div className="category-topbar">
        <h1 className="category-heading">Browse Categories</h1>

        <div className="category-filters">
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="" disabled>Sort By</option>
            <option value="name">Name (A-Z)</option>
            <option value="count">Most Products</option>
            <option value="recommended">Recommended</option>
            <option value="best">Best Selling</option>
          </select>

          {/* <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
            <option value="" disabled>Filter</option>
            <option value="empty">Empty Only</option>
          </select> */}

          {/* <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
            <option value="" disabled>Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select> */}

          {/* <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="" disabled>Price Range</option>
            <option value="low">Under 10</option>
            <option value="mid">11–50</option>
            <option value="high">Above 50</option>
          </select> */}

          <button className="reset-button" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      <div className={`category-grid ${singleCategory ? 'single-category-grid' : ''}`}>
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="category-card skeleton">
                <div className="card-content">
                  <div className="skeleton-img" />
                  <div className="skeleton-line" />
                </div>
              </div>
            ))
          : displayedCategories.map((cat) => (
              <Link to={`/category/${cat.slug}`} key={cat.id} className="category-card">
                <div className="card-content">
                  <img
                    src={cat.image?.src || 'https://via.placeholder.com/300x200'}
                    alt={decodeHTML(cat.name)}
                    className="category-img"
                  />
                  <p className="category-name">{decodeHTML(cat.name)}</p>
                </div>
              </Link>
            ))}
      </div>

      {!loading && visibleCount < categories.length && (
        <div className="loadmore-section">
          <button className="loadmore-button" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;

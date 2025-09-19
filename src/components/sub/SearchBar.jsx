// src/components/sub/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/SearchBar.css";
import { useNavigate } from "react-router-dom";
import { searchProducts, getTopSoldProducts } from "../../api/woocommerce";
import { useAuth } from "../../contexts/AuthContext";

import category1 from '../../assets/images/megamenu/Sub catogory Webp/Baby Care & Hygiene copy.webp';
import Category2 from '../../assets/images/megamenu/Sub catogory Webp/Electronic Toys copy.webp';
import Category3 from '../../assets/images/megamenu/Sub catogory Webp/Smart Home Devices copy.webp';
import Category4 from '../../assets/images/megamenu/Sub catogory Webp/Wedding Dresses copy.webp';
import category5 from '../../assets/images/megamenu/Sub catogory Webp/Sports & Outdoor Toys copy.webp';

const BEST_CATEGORIES = [
  { id: "6634", name: "Baby Products", image: category1 },
  { id: "498", name: "Electronics", image: Category2 },
  { id: "6519", name: "Home & Kitchen", image: Category3 },
  { id: "6523", name: "Fashion", image: Category4 },
  { id: "6530", name: "Sports", image: category5 },
];

const SearchBar = () => {
  const { user } = useAuth();
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const RECENT_SEARCH_KEY = "guest_recent_searches";

  // Load recent searches for guest users
  useEffect(() => {
    if (!user?.id) {
      const stored = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]");
      setRecentSearches(stored);
    }
  }, [user]);

  // Fetch top sold products (last 24h)
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const results = await getTopSoldProducts(24);
        setTopProducts(results.slice(0, 5));
      } catch (err) {
        console.error("Error fetching top sold products:", err);
        setTopProducts([]);
      }
    };
    fetchTopProducts();
  }, []);

  // Fetch search suggestions dynamically
  useEffect(() => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const results = await searchProducts(term);
        const mapped = results.map((p) => ({
          label: p.name,
          slug: p.slug,
          id: p.id,
        }));
        setSuggestions(mapped.slice(0, 10));
      } catch (err) {
        console.error("Error searching products:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [term]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapper.current && !wrapper.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  };
  const handleMouseEnter = () => clearTimeout(timeoutRef.current);

  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    if (!user?.id) {
      const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    }
  };

const goToProduct = (slug = null, customLabel = "") => {
  const searchTerm = customLabel || term;
  saveRecentSearch(searchTerm);

  // Do NOT clear term here
  if (slug) navigate(`/product/${slug}`);
  else navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
};

  const goToCategory = (slug) => navigate(`/category/${slug}`);

  const highlightTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="highlight-term">{part}</span> : part
    );
  };

  const matchingCategories = term
    ? BEST_CATEGORIES.filter(
        (cat) =>
          cat.name.toLowerCase().includes(term.toLowerCase()) ||
          cat.id.includes(term)
      )
    : [];

  return (
    <div
      className="scoped-search-wrap"
      ref={wrapper}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className={`scoped-search-bar ${open ? "focused" : ""}`}
        onClick={() => setOpen(true)}
      >
        <input
          className="scoped-search-input"
          type="text"
          placeholder="Search products by name, slug, or ID"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter") goToProduct(); }}
          autoComplete="off"
          spellCheck="false"
        />
        {term && (
          <button
            className="scoped-search-clear"
            onClick={() => setTerm("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        <button
          className="scoped-search-btn"
          onClick={() => goToProduct()}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="scoped-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="scoped-search-dropdown">
          <div className="scoped-search-grid">

            {/* Matching Categories */}
            {term && matchingCategories.length > 0 && (
              <>
                <div className="scoped-search-title">Categories</div>
                {matchingCategories.map((cat) => (
                  <div
                    key={`cat-${cat.id}`}
                    className="scoped-search-item category-search-item"
                    onMouseDown={() => goToCategory(cat.id)}
                  >
                    <img src={cat.image} alt={cat.name} style={{ width: '24px', marginRight: '8px' }} />
                    {highlightTerm(cat.name, term)}
                  </div>
                ))}
              </>
            )}

            {/* Live search suggestions */}
            {term && suggestions.length > 0 && (
              <>
                <div className="scoped-search-title">Products</div>
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="scoped-search-item"
                    onMouseDown={() => { setTerm(item.label); goToProduct(item.slug, item.label); }}
                  >
                    {highlightTerm(item.label, term)} {item.id ? `(ID: ${item.id})` : ""}
                  </div>
                ))}
              </>
            )}

            {/* No results */}
            {term && suggestions.length === 0 && matchingCategories.length === 0 && (
              <div className="scoped-search-item muted">No results found</div>
            )}

            {/* Recent Searches */}
           // Inside the JSX for dropdown
{!term && recentSearches.length > 0 && (
  <>
    <div className="scoped-search-title">Recent Searches</div>
    {recentSearches.map((s, idx) => (
      <div
        key={`recent-${idx}`}
        className="scoped-search-item"
        onMouseDown={() => {
          // Do NOT clear term immediately
          setTerm(s); // fill input with selected term
          goToProduct(null, s); // navigate/search
        }}
      >
        {s}
      </div>
    ))}
  </>
)}


            {/* Best Categories */}
            {!term && BEST_CATEGORIES.length > 0 && (
              <>
                <div className="scoped-search-title" style={{ marginTop: '12px' }}>Best Selling Categories</div>
                <div className="categories-grid">
                  {BEST_CATEGORIES.map(cat => (
                    <div
                      key={cat.id}
                      className="category-item"
                      onMouseDown={() => goToCategory(cat.id)}
                    >
                      <img src={cat.image} alt={cat.name} />
                      <span style={{color:"#000"}}>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

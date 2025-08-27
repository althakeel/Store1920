import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../assets/styles/SearchBar.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CK = "ck_2e4ba96dde422ed59388a09a139cfee591d98263";
const CS = "cs_43b449072b8d7d63345af1b027f2c8026fd15428";

const SearchBar = () => {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Fetch and filter suggestions dynamically
  useEffect(() => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`, {
          auth: { username: CK, password: CS },
          params: {
            per_page: 50, // fetch more to allow substring matching
            orderby: "date",
            order: "desc",
          },
          signal: controller.signal,
        });

        const termLower = term.toLowerCase();

        // Filter results by name, slug, or ID (case-insensitive)
        const filtered = res.data.filter((p) => 
          p.name.toLowerCase().includes(termLower) ||
          p.slug.toLowerCase().includes(termLower) ||
          String(p.id).includes(term)
        );

        const mapped = filtered.map((p) => ({
          label: p.name,
          slug: p.slug,
          id: p.id,
        }));

        setSuggestions(mapped.slice(0, 10)); // show top 10 results
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching suggestions:", err);
        }
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [term]);

  // Handle clicks outside dropdown
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

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const goToProduct = (slug = null, customLabel = "") => {
    const searchTerm = customLabel || term;
    if (slug) {
      navigate(`/product/${slug}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

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
          onKeyDown={(e) => {
            if (e.key === "Enter") goToProduct();
          }}
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
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <div
                  key={index}
                  className="scoped-search-item"
                  onMouseDown={() => {
                    setTerm(item.label);
                    goToProduct(item.slug, item.label);
                  }}
                >
                  {item.label} {item.id ? `(ID: ${item.id})` : ""}
                </div>
              ))
            ) : (
              <div className="scoped-search-item muted">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

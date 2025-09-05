import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/MegaMenu.css";
const API_V3 = "https://db.store1920.com/wp-json/wc/v3";
const CK = "ck_2e4ba96dde422ed59388a09a139cfee591d98263";
const CS = "cs_43b449072b8d7d63345af1b027f2c8026fd15428";
const MegaMenu = ({ onClose }) => {
  const [parentCategories, setParentCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const navigate = useNavigate();
  // Decode HTML entities
  const decodeHTML = (str) => {
    if (!str) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };
  // Fetch categories from WooCommerce
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_V3}/products/categories`, {
        auth: { username: CK, password: CS },
        params: { per_page: 100, hide_empty: false },
      });
      const categories = res.data.map((cat) => ({
        ...cat,
        id: Number(cat.id),
        parent: Number(cat.parent || 0),
      }));
      // Save to localStorage
      localStorage.setItem("allCategories", JSON.stringify(categories));
      const parents = categories.filter((c) => c.parent === 0);
      setParentCategories(parents);
      setAllCategories(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  useEffect(() => {
    const cachedCategories = localStorage.getItem("allCategories");
    if (cachedCategories) {
      const categories = JSON.parse(cachedCategories);
      setAllCategories(categories);
      setParentCategories(categories.filter((c) => c.parent === 0));
    } else {
      fetchCategories();
    }
  }, []);
  // Automatically select first parent
  useEffect(() => {
    if (parentCategories.length > 0) {
      handleHover(parentCategories[0]);
    }
  }, [parentCategories]);
  const handleHover = (cat) => {
    if (!cat) return;
    setActiveCategory(cat);
    setLoadingSubs(true);
    const subs = allCategories.filter((c) => c.parent === cat.id);
    setSubCategories(subs);
    setLoadingSubs(false);
  };
  return (
    <div className="custom-megamenu-container">
      {/* LEFT SIDE - Parent Categories */}
      <div className="custom-megamenu-left">
        {parentCategories.map((cat) => (
          <div
            key={cat.id}
            className={`custom-megamenu-left-item ${
              activeCategory?.id === cat.id ? "active" : ""
            }`}
            onMouseEnter={() => handleHover(cat)}
          >
            {decodeHTML(cat.name)}
          </div>
        ))}
      </div>
      {/* RIGHT SIDE - Subcategories */}
      <div className="custom-megamenu-right">
        {activeCategory ? (
          <>
            <h2
              className="custom-megamenu-title"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // Pass ID instead of slug
                navigate(`/category/${activeCategory.id}`);
                if (onClose) onClose();
              }}
            >
              {`All ${decodeHTML(activeCategory.name)} →`}
            </h2>
            {subCategories.length > 0 ? (
              <div className="custom-megamenu-grid">
                {subCategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="custom-megamenu-item"
                    onClick={() => {
                      navigate(`/category/${sub.id}`);
                      if (onClose) onClose();
                    }}
                  >
                    <div className="custom-megamenu-imgbox">
                      <img
                        src={sub.image?.src || "https://via.placeholder.com/140?text=No+Image"}
                        alt={decodeHTML(sub.name)}
                      />
                    </div>
                    <span>{decodeHTML(sub.name)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="custom-megamenu-empty">No subcategories found</p>
            )}
          </>
        ) : (
          <p className="custom-megamenu-empty">Select a category</p>
        )}
      </div>
    </div>
  );
};
export default MegaMenu;
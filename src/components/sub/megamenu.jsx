// MegaMenu.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate hook

import "../../assets/styles/MegaMenu.css";

const MegaMenu = ({ categories }) => {
  
  const [activeCategory, setActiveCategory] = useState(
    categories && categories.length > 0 ? categories[0] : null
  );
  const navigate = useNavigate();  // ✅ navigation hook

  const decodeHTML = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  // Update activeCategory if categories prop changes
  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  if (!categories || categories.length === 0) {
    return <div className="custom-megamenu-empty">No categories found</div>;
  }

  return (
    <div className="custom-megamenu-container">
      {/* LEFT SIDE: Main Categories */}
      <div className="custom-megamenu-left">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onMouseEnter={() => setActiveCategory(cat)}
            onClick={() => setActiveCategory(cat)}
            className={`custom-megamenu-left-item ${
              activeCategory?.id === cat.id ? "active" : ""
            }`}
          >
            {decodeHTML(cat.name)}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE: Subcategories */}
      <div className="custom-megamenu-right">
        <h2 className="custom-megamenu-title">
          {activeCategory ? `All ${decodeHTML(activeCategory.name)} →` : ""}
        </h2>

        {activeCategory?.subCategories?.length > 0 ? (
          <div className="custom-megamenu-grid">
            {activeCategory.subCategories.map((sub) => (
              <div key={sub.id} className="custom-megamenu-item"
              onClick={() => navigate(`/categorypage/${sub.id}`)}
              >
                <div className="custom-megamenu-imgbox">
                  <img
                    src={
                      sub.image?.src ||
                      "https://via.placeholder.com/140?text=No+Image"
                    }
                    alt={decodeHTML(sub.name)}
                  />
                </div>
                <span>{decodeHTML(sub.name)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="custom-megamenu-empty">No subcategories available</p>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;

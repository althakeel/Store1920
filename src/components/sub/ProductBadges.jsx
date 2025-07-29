// src/components/ProductBadges.js
import React from 'react';
import '../../assets/styles/ProductBadges.css'; // optional, for styling

const badgeLabels = {
  best_seller: 'Best Seller',
  recommended: 'Recommended',
};

const ProductBadges = ({ badges }) => {
  if (!Array.isArray(badges) || badges.length === 0) return null;

  return (
    <div className="product-badges">
      {badges.map((badge) => (
        <span key={badge} className={`badge badge-${badge}`}>
          {badgeLabels[badge] || badge}
        </span> 
      ))} from this seller
    </div>
  );
};

export default ProductBadges;

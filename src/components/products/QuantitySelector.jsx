import React from 'react';
import '../../assets/styles/QuantitySelector.css';

export default function QuantitySelector({ quantity, setQuantity, maxQuantity }) {
  // Determine maximum quantity allowed (default 100 if invalid)
  const maxQty = typeof maxQuantity === 'number' && maxQuantity > 0 ? maxQuantity : 100;

  // Generate quantity options array [1, 2, ..., maxQty]
  const quantities = Array.from({ length: maxQty }, (_, i) => i + 1);

  return (
    <div className="quantity-selector-container">
      <label htmlFor="quantity-select" className="quantity-label">
        Quantity:
      </label>
      <select
        id="quantity-select"
        className="quantity-select"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
      >
        {quantities.map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </select>
    </div>
  );
}

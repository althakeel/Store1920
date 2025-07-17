import React from 'react';
import '../../assets/styles/PriceDisplay.css';

// Helper to decode HTML entities (e.g. &#x62f; etc.)
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export default function PriceDisplay({ product, selectedVariation }) {
  // Price data - use variation price if selected
  const price = selectedVariation?.price || product.price;
  const regularPrice = selectedVariation?.regular_price || product.regular_price;
  const salePrice = selectedVariation?.sale_price || product.sale_price;

  // Decode currency symbol (fallback to $)
  const currency = decodeHtml(product.currency_symbol || '$');

  // Calculate discount percentage
  let discountPercent = 0;
  if (regularPrice && salePrice && regularPrice !== salePrice) {
    discountPercent = Math.round(
      ((parseFloat(regularPrice) - parseFloat(salePrice)) / parseFloat(regularPrice)) * 100
    );
  }

  return (
    <div className="pd-price-container">
      {salePrice && salePrice !== regularPrice ? (
        <>
          <span className="pd-sale-price">
            {currency}{parseFloat(salePrice).toFixed(2)}
          </span>
          <span className="pd-regular-price">
            {currency}{parseFloat(regularPrice).toFixed(2)}
          </span>
          {discountPercent > 0 && (
            <span className="pd-discount-badge">{discountPercent}% OFF</span>
          )}
        </>
      ) : (
        <span className="pd-sale-price">
          {currency}{parseFloat(price).toFixed(2)}
        </span>
      )}
    </div>
  );
}

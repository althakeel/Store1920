import React from 'react';
import '../../assets/styles/PriceDisplay.css';
import DirhamIcon from '../../assets/images/Dirham 2.png';

function safeParsePrice(value) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

export default function PriceDisplay({ product, selectedVariation }) {
  // Get default variation (first one)
  const defaultVariation = product.variations?.[0] || {};

  // Fallback order: selectedVariation -> defaultVariation -> product
  const price = selectedVariation?.price ?? defaultVariation.price ?? product.price ?? 0;
  const regularPrice = selectedVariation?.regular_price ?? defaultVariation.regular_price ?? product.regular_price ?? 0;
  const salePrice = selectedVariation?.sale_price ?? defaultVariation.sale_price ?? product.sale_price ?? 0;

  const priceNum = safeParsePrice(price);
  const regularPriceNum = safeParsePrice(regularPrice);
  const salePriceNum = safeParsePrice(salePrice);

  let discountPercent = 0;
  if (regularPriceNum > 0 && salePriceNum > 0 && regularPriceNum !== salePriceNum) {
    discountPercent = Math.round(((regularPriceNum - salePriceNum) / regularPriceNum) * 100);
  }

  return (
    <div className="pd-price-container">
      {salePriceNum > 0 && salePriceNum !== regularPriceNum ? (
        <>
          <span className="pd-sale-price">
            <span className="price-wrapper">
              <img src={DirhamIcon} alt="Dirham" className="currency-icon" />
              {salePriceNum.toFixed(2)}
            </span>
          </span>

          <span className="pd-regular-price">
            <span className="price-wrapper">
              <img src={DirhamIcon} alt="Dirham" className="currency-icon1" />
              {regularPriceNum.toFixed(2)}
            </span>
          </span>

          {discountPercent > 0 && <span className="pd-discount-badge">{discountPercent}% OFF</span>}
        </>
      ) : (
        <span className="pd-sale-price">
          <span className="price-wrapper">
            <img src={DirhamIcon} alt="Dirham" className="currency-icon" />
            {priceNum.toFixed(2)}
          </span>
        </span>
      )}
    </div>
  );
}

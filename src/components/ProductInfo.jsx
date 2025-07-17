import React, { useState } from 'react';
import '../assets/styles/ProductInfo.css';
import OfferBox from './OfferBox';
import ProductBadges from './ProductSellerbadge';
import ShareDropdown from './ShareDropdown';
import PriceDisplay from './products/PriceDisplay';
import ProductVariants from './products/ProductVariants';
import ClearanceSaleBox from './products/ClearanceSaleBox';
import QuantitySelector from './products/QuantitySelector';
import ButtonSection from './products/ButtonSection';
import OrderPerks from './products/OrderPerks';
import ProductShortDescription from './products/ProductShortDescription';
import ItemDetailsTable from './products/ItemDetailsTable';
import CompareButton from './CompareButton';

export default function ProductInfo({ product, variations, selectedVariation, onVariationChange }) {
  const [quantity, setQuantity] = useState(1);
  const [hasItemDetails, setHasItemDetails] = useState(false);

  if (!product) return null;

  const showClearance = product.show_clearance_sale === true;
  const clearanceEndTime = product.clearance_end_time;

  return (
    <section className="product-info">
      <OfferBox />

      <div className="product-title-row">
        <div className="badges-and-title">
          <ProductBadges badges={product.custom_seller_badges || []} />
          <h1>{product.name}</h1>
        </div>
        <ShareDropdown url={window.location.href} />
      </div>

      <PriceDisplay product={product} selectedVariation={selectedVariation} />
      <ProductShortDescription shortDescription={product.short_description} />

      {showClearance && clearanceEndTime ? (
        <ClearanceSaleBox endTime={clearanceEndTime}>
          <ProductVariants
            variations={variations}
            selectedVariation={selectedVariation}
            onVariationChange={onVariationChange}
          />
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        </ClearanceSaleBox>
      ) : (
        <>
          <ProductVariants
            variations={variations}
            selectedVariation={selectedVariation}
            onVariationChange={onVariationChange}
          />
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        </>
      )}
   <CompareButton/>
      <ButtonSection
        product={product}
        selectedVariation={selectedVariation}
        quantity={quantity}
        isClearance={showClearance}
      />

      {/* Conditionally render ItemDetailsTable only if it has data */}
      {hasItemDetails && (
        <ItemDetailsTable
          postId={product.id}
          postType="posts"
          onHasData={(exists) => setHasItemDetails(exists)}
        />
      )}

      {/* OrderPerks now manages its own modal state internally */}
      <OrderPerks />
    </section>
  );
}

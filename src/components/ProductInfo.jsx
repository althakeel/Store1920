import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // You need this for navigation
import { useCart } from '../contexts/CartContext'; // Adjust path if needed

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
import ProductBadgesseller from './sub/ProductBadges';

export default function ProductInfo({ product, variations, selectedVariation, onVariationChange }) {
  const [quantity, setQuantity] = useState(1);
  const [hasItemDetails, setHasItemDetails] = useState(false);
  const isOutOfStock = selectedVariation?.stock_status === 'outofstock';

  // Extract brand from attributes (e.g., "Brand" or "pa_brand")
const brandAttribute = product.attributes?.find(attr => {
  if (!attr.name) return false;
  const name = attr.name.toLowerCase();
  const slug = (attr.slug || '').toLowerCase();
  return name.includes('brand') || slug.includes('brand');
});
const brandOptions = brandAttribute?.options || [];
const brand = brandOptions.length ? brandOptions[0] : null;


  // Parse stock quantities as numbers (handle strings from API)
  const rawQty = Number(selectedVariation?.stock_quantity);
  const productQty = Number(product?.stock_quantity);
  const manageStock = selectedVariation?.manage_stock;

  const maxQuantity =
    manageStock && Number.isInteger(rawQty) && rawQty > 0
      ? rawQty
      : Number.isInteger(productQty) && productQty > 0
      ? productQty
      : 99;

  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  if (!product) return null;

  const showClearance = product.show_clearance_sale === true;
  const clearanceEndTime = product.clearance_end_time;

  // Define handleAddToCart here, so it has access to latest quantity and variation
  const handleAddToCart = () => {
    const variation = selectedVariation || product;

    const itemToAdd = {
      id: variation.id,
      name: product.name,
      quantity,
      price: variation.price || product.price,
      image: variation.image?.src || product.images?.[0]?.src || '',
      variation: selectedVariation?.attributes || [],
    };

    addToCart(itemToAdd);
    setIsCartOpen(true);

    if (showClearance) {
      navigate('/checkout'); // Direct to checkout if clearance sale
    }
  };

  return (
    <section className="product-info">
      <OfferBox />

      <div className="product-title-row">
        <div className="badges-and-title">
          <ProductBadges badges={product.custom_seller_badges || []} />
          <h1>{product.name}</h1>
          <ProductBadgesseller />
          
          {product.sku && (
            <p className="product-sku">SKU: {product.sku}</p>
          )}
          
          {brand && (
            <p className="product-brand">Brand: {brand}</p>
          )}
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
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={maxQuantity}
          />
        </ClearanceSaleBox>
      ) : (
        <>
          <ProductVariants
            variations={variations}
            selectedVariation={selectedVariation}
            onVariationChange={onVariationChange}
            maxQuantity={maxQuantity}
          />
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={maxQuantity}
          />
        </>
      )}

      <ButtonSection
        product={product}
        selectedVariation={selectedVariation}
        quantity={quantity}
        isClearance={showClearance}
        handleAddToCart={handleAddToCart} // <-- Pass handleAddToCart here
      />

      {hasItemDetails && (
        <ItemDetailsTable
          postId={product.id}
          postType="posts"
          onHasData={(exists) => setHasItemDetails(exists)}
        />
      )}

      <OrderPerks />
    </section>
  );
}

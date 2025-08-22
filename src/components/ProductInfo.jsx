import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

import '../assets/styles/ProductInfo.css';

import OfferBox from './OfferBox';
import ProductBadges from './ProductSellerbadge';
import ProductBadgesseller from './sub/ProductBadges';
import ShareDropdown from './ShareDropdown';
import PriceDisplay from './products/PriceDisplay';
import ProductVariants from './products/ProductVariants';
import ClearanceSaleBox from './products/ClearanceSaleBox';
import QuantitySelector from './products/QuantitySelector';
import ButtonSection from './products/ButtonSection';
import OrderPerks from './products/OrderPerks';
import ProductShortDescription from './products/ProductShortDescription';
import ItemDetailsTable from './products/ItemDetailsTable';
// import DummyReviewsSold from '../components/temp/DummyReviewsSold';
import ProductCardReviews from '../components/temp/productcardreviews'


export default function ProductInfo({ product, variations, selectedVariation, onVariationChange }) {
  const [quantity, setQuantity] = useState(1);
  const [hasItemDetails, setHasItemDetails] = useState(false);

  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const isOutOfStock = selectedVariation?.stock_status === 'outofstock';

  // Reset quantity when selected variation changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariation]);

  // Extract brand attribute
  const brandAttribute = product.attributes?.find(attr => {
    if (!attr.name) return false;
    const name = attr.name.toLowerCase();
    const slug = (attr.slug || '').toLowerCase();
    return name.includes('brand') || slug.includes('brand');
  });
  const brandOptions = brandAttribute?.options || [];
  const brand = brandOptions.length ? brandOptions[0] : null;

  // Stock quantity calculation
  const rawQty = Number(selectedVariation?.stock_quantity);
  const productQty = Number(product?.stock_quantity);
  const manageStock = selectedVariation?.manage_stock;
  const maxQuantity =
    manageStock && Number.isInteger(rawQty) && rawQty > 0
      ? rawQty
      : Number.isInteger(productQty) && productQty > 0
      ? productQty
      : 99;

  if (!product) return null;

  const showClearance = product.show_clearance_sale === true;
  const clearanceEndTime = product.clearance_end_time;

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

    if (showClearance) navigate('/checkout'); // Go to checkout for clearance
  };

  return (
    <section className="pi-product-info">
      <OfferBox />

      <div className="pi-product-title-row">
        <div className="pi-badges-and-title">
          <ProductBadges badges={product.custom_seller_badges || []} />
          <h1 style={{margin:'5px 0'}}>{product.name} <ShareDropdown url={window.location.href} /></h1>
          <ProductBadgesseller />
       <ProductCardReviews 
  productId={product.id}   // Pass the WooCommerce product ID
  soldCount={product.total_sales || 0} // Optional: use WooCommerce total sales if available
/>

          {product.sku && <p className="pi-product-sku">SKU: {product.sku}</p>}
          {brand && <p className="pi-product-brand">Brand: {brand}</p>}
        </div>
        
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
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} maxQuantity={maxQuantity} />
        </ClearanceSaleBox>
      ) : (
        <>
          <ProductVariants
            variations={variations}
            selectedVariation={selectedVariation}
            onVariationChange={onVariationChange}
            maxQuantity={maxQuantity}
          />
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} maxQuantity={maxQuantity} />
        </>
      )}

      <ButtonSection
        product={product}
        selectedVariation={selectedVariation}
        quantity={quantity}
        isClearance={showClearance}
        handleAddToCart={handleAddToCart}
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

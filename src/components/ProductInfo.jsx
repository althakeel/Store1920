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

export default function ProductInfo({ product, variations, selectedVariation, onVariationChange }) {
  const [quantity, setQuantity] = useState(1);
  const [hasItemDetails, setHasItemDetails] = useState(false);
  const isOutOfStock = selectedVariation?.stock_status === 'outofstock';

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
            maxQuantity={selectedVariation?.stock_quantity}
          />
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

import React from 'react';
import '../../assets/styles/checkoutleft/itemlist.css';

const ItemList = ({ items }) => {
  if (!items || items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="cart-summary">
      <h3>Items in Cart ({items.length})</h3>
      <div className="cart-grid">
        {items.map((item, index) => {
          const imageUrl = item.images?.[0]?.src || '';
          const rawPrice = item.prices?.price ?? item.price ?? 0;
          const price = parseFloat(rawPrice).toFixed(2);
          const key = item.id || item.product_id || index;

          return (
            <div className="cart-grid-item" key={key}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.name || 'Product image'}
                  className="cart-item-image"
                />
              ) : (
                <div className="cart-item-placeholder">No image</div>
              )}
              <div className="cart-item-price">
                AED {price} × {item.quantity ?? 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemList;

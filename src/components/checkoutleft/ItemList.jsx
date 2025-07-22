import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/checkoutleft/itemlist.css';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces to hyphens
    .replace(/[^\w\-]+/g, '')    // remove non-word chars
    .replace(/\-\-+/g, '-');     // collapse multiple hyphens

const ItemList = ({ items, onRemove }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const handleItemClick = (product) => {
    if (product.name) {
      const slug = slugify(product.name);
      navigate(`/product/${slug}`);
    }
  };

  return (
    <div className="cart-summary">
      <h3>Items in Cart ({items.length})</h3>
      <div className="cart-grid">
        {items.map((item, index) => {
          const imageUrl =
            item.images?.[0]?.src ||
            item.images?.[0]?.url ||
            item.image ||
            '';

          const rawPrice = item.prices?.price ?? item.price ?? 0;
          const price = parseFloat(rawPrice).toFixed(2);

          const key = item.id || item.product_id || index;

          return (
            <div
              className="cart-grid-item"
              key={key}
              onClick={() => handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick(item);
                }
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.name || 'Product image'}
                  className="cart-item-image"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div className="cart-item-placeholder">No image</div>
              )}

              <div className="cart-item-price">
                AED {price} × {item.quantity ?? 1}
              </div>

              {onRemove && (
                <button
                  className="cart-item-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(key);
                  }}
                  aria-label={`Remove ${item.name || 'item'} from cart`}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemList;

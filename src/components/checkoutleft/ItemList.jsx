import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/checkoutleft/itemlist.css';
import { useCart } from '../../contexts/CartContext';

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
const { removeFromCart } = useCart(); // optional fallback to context

  if (!items || items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const handleItemClick = (product) => {
    if (product.name) {
      const slug = slugify(product.name);
      navigate(`/product/${slug}`);
    }
  };

  const handleRemove = (itemId) => {
    if (onRemove) {
      onRemove(itemId);
    } else {
      removeFromCart?.(itemId);
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

          const rawPrice = item.prices?.price ?? item.price ?? '';
          const priceFloat = parseFloat(rawPrice);
          const price = !isNaN(priceFloat) ? priceFloat.toFixed(3) : '';

          const hasStockInfo =
            item.hasOwnProperty('stock_quantity') ||
            item.hasOwnProperty('in_stock') ||
            item.hasOwnProperty('is_in_stock') ||
            item.hasOwnProperty('stock_status');

          const stockOutByQuantity =
            typeof item.stock_quantity === 'number' && item.stock_quantity <= 0;

          const stockOutByFlag =
            (typeof item.in_stock === 'boolean' && !item.in_stock) ||
            (typeof item.is_in_stock === 'boolean' && !item.is_in_stock) ||
            (typeof item.stock_status === 'string' && item.stock_status.toLowerCase() !== 'instock');

          const isOutOfStock =
            (!price || priceFloat === 0) || (hasStockInfo && (stockOutByQuantity || stockOutByFlag));

          const key = item.id || item.product_id || index;

          return (
            <div
              className={`cart-grid-item ${isOutOfStock ? 'out-of-stock' : ''}`}
              key={key}
              onClick={() => !isOutOfStock && handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isOutOfStock) {
                  handleItemClick(item);
                }
              }}
              aria-disabled={isOutOfStock}
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

              {isOutOfStock && (
                <div className="out-of-stock-badge" aria-label="Out of stock">
                  Out of Stock
                </div>
              )}

              <div className="cart-item-price">
                AED {price || 'N/A'} × {item.quantity ?? 1}
              </div>

              <button
                className="cart-item-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  const itemId = item.id ?? item.product_id ?? item.sku ?? index;
                  handleRemove(itemId);
                }}
                aria-label={`Remove ${item.name || 'item'} from cart`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemList;

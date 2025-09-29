import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/checkoutleft/itemlist.css';
import { useCart } from '../../contexts/CartContext';

// Utility: convert product name to slug
const slugify = (text) =>
  text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') || '';

const ItemList = ({ items = [], onRemove }) => {
  const navigate = useNavigate();
  const { removeFromCart } = useCart();

  if (!items.length) return <p className="empty-cart-msg">Your cart is empty.</p>;

  const handleItemClick = (item) => {
    if (!item || !item.name) return;
    navigate(`/product/${slugify(item.name)}`);
  };

  const handleRemove = (id) => {
    if (onRemove) onRemove(id);
    else removeFromCart?.(id);
  };

  return (
    <div className="cart-summary">
      <h3 className="cart-title">Items in Cart ({items.length})</h3>
      <div className="cart-grid">
        {items.map((item, index) => {
          const key = item.id ?? item.product_id ?? index;
          const imageUrl = item.images?.[0]?.src || item.images?.[0]?.url || item.image || '';
          const rawPrice = item.prices?.price ?? item.price ?? 0;
          const price = parseFloat(rawPrice).toFixed(1);

          const hasStockInfo = ['stock_quantity', 'in_stock', 'is_in_stock', 'stock_status'].some(
            (key) => Object.prototype.hasOwnProperty.call(item, key)
          );

          const stockOutByQuantity = typeof item.stock_quantity === 'number' && item.stock_quantity <= 0;
          const stockOutByFlag =
            (typeof item.in_stock === 'boolean' && !item.in_stock) ||
            (typeof item.is_in_stock === 'boolean' && !item.is_in_stock) ||
            (typeof item.stock_status === 'string' && item.stock_status.toLowerCase() !== 'instock');

          const isOutOfStock = (!price || parseFloat(price) <= 0) || (hasStockInfo && (stockOutByQuantity || stockOutByFlag));

          return (
            <div
              key={key}
              className={`cart-grid-item ${isOutOfStock ? 'out-of-stock' : ''}`}
              onClick={() => !isOutOfStock && handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isOutOfStock) handleItemClick(item);
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

              {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}

              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">AED {price} × {item.quantity ?? 1}</p>
              </div>

              <button
                className="cart-item-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id ?? item.product_id ?? item.sku ?? index);
                }}
                aria-label={`Remove ${item.name ?? 'item'} from cart`}
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

import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../assets/styles/related-products.css';
import AddCarticon from '../assets/images/addtocart.png';
import AddedToCartIcon from '../assets/images/added-cart.png';
import DummyReviewsSold from '../components/temp/productcardreviews';
import Dirham from '../assets/images/Dirham 2.png';
import PlaceHolderImage from '../assets/images/common/Placeholder.png';

// WooCommerce helper
import { getProductById, getProductsByIds } from '../utils/woocommerce';

// ---------------- Skeleton Loader ----------------
function SkeletonCard() {
  return (
    <div className="hr-skeleton-card">
      <div className="hr-skeleton-image" />
      <div className="hr-skeleton-text" />
      <div className="hr-skeleton-text short" />
      <div className="hr-skeleton-bottom">
        <div className="hr-skeleton-price" />
        <div className="hr-skeleton-btn" />
      </div>
    </div>
  );
}

// ---------------- Toast Component ----------------
function Toast({ message, visible }) {
  return (
    <div
      className={`toast ${visible ? 'show' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="toast-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="toast-message">{message}</span>
      <style jsx>{`
        .toast {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background-color: #28a745;
          color: white;
          padding: 14px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.4s ease;
          z-index: 9999;
          min-width: 250px;
          max-width: 90vw;
        }
        .toast.show {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .toast-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .toast-message {
          flex: 1;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

// ---------------- Horizontal Related Products ----------------
export default function HorizontalRelatedProducts({ productId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', visible: false });

  const { cartItems, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) return;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const product = await getProductById(productId);
        if (!product) return;

        let related = [];

        // 1️⃣ Related IDs
        if (product.related_ids?.length) {
          const relatedData = await getProductsByIds(product.related_ids);
          related = relatedData.filter(p => p?.id && p.id !== productId);
        }

        // 2️⃣ Category fallback
        if (!related.length && product.categories?.length) {
          const categoryIds = product.categories.map(c => c.id);
          const categoryProducts = await Promise.all(
            categoryIds.map(id => getProductsByIds([id]))
          );
          related = categoryProducts.flat().filter(p => p.id !== productId);
        }

        // 3️⃣ Tag fallback
        if (!related.length && product.tags?.length) {
          const tagIds = product.tags.map(t => t.id);
          const tagProducts = await Promise.all(
            tagIds.map(id => getProductsByIds([id]))
          );
          related = tagProducts.flat().filter(p => p.id !== productId);
        }

        // 4️⃣ Latest fallback
        if (!related.length) {
          const latest = await getProductsByIds([]);
          related = latest.filter(p => p.id !== productId);
        }

        setRelatedProducts(related.slice(0, 10)); // limit to 10
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [productId]);

  const showToastMessage = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const truncate = (str, max = 25) => (str?.length > max ? str.substring(0, max) + '...' : str);

  const getPrice = (prod) => {
    const regular = parseFloat(prod.regular_price);
    const sale = parseFloat(prod.sale_price);
    const price = parseFloat(prod.price);

    const validRegular = isNaN(regular) ? null : regular;
    const validSale = isNaN(sale) ? null : sale;
    const validPrice = isNaN(price) ? null : price;

    return {
      regular: validRegular || validPrice || 0,
      sale: validSale || (validPrice !== validRegular ? validPrice : null),
    };
  };

  const calcDiscount = (regular, sale) => {
    if (regular && sale && regular > sale) {
      return Math.round(((regular - sale) / regular) * 100);
    }
    return 0;
  };

  const handleAddToCart = (product) => {
    const exists = cartItems.some(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.variation || []) === JSON.stringify(product.variation || [])
    );

    if (exists) {
      showToastMessage(`"${product.name}" is already in the cart.`);
      return;
    }

    addToCart(product);
    showToastMessage(`Added "${product.name}" to cart!`);
  };

  const handleNavigate = (product) => {
    navigate(`/product/${product.slug || product.id}`);
  };

  if (loading) {
    return (
      <div className="horizontal-related-wrapper">
        <div className="horizontal-related-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts.length) {
    return <p style={{ textAlign: 'center' }}>No related products found.</p>;
  }

  const formatPrice = (price) => {
    const [integer, decimal] = price.toFixed(2).split('.');
    return (
      <>
        <span style={{ fontSize: '20px', fontWeight: '700' }}>{integer}</span>
        <span style={{ fontSize: '10px', fontWeight: '500' }}>.{decimal}</span>
      </>
    );
  };

  return (
    <>
      <div className="horizontal-related-wrapper">
        <h2 className="hr-heading">Recommended for You</h2>
        <div className="horizontal-related-list">
          {relatedProducts.map((prod) => {
            const image = prod.images?.[0]?.src || PlaceHolderImage;
            const { regular, sale } = getPrice(prod);
            const displayPrice = sale && sale < regular ? sale : regular;
            const discount = calcDiscount(regular, sale);

            const isInCart = cartItems.some(
              (item) =>
                item.id === prod.id &&
                JSON.stringify(item.variation || []) === JSON.stringify(prod.variation || [])
            );

            return (
              <div className="horizontal-related-card" key={prod.id}>
                <img
                  src={image}
                  alt={prod.name}
                  className="hr-product-image"
                  onClick={() => handleNavigate(prod)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="hr-card-info">
                  <div
                    className="hr-product-name"
                    title={prod.name}
                    onClick={() => handleNavigate(prod)}
                    style={{ cursor: 'pointer' }}
                  >
                    {truncate(prod.name)}
                  </div>
                  <div
                    style={{
                      height: '1px',
                      width: '100%',
                      backgroundColor: 'lightgrey',
                      margin: '0px 0 2px 0',
                      borderRadius: '1px',
                    }}
                  />
                  <DummyReviewsSold />

                  <div className="hr-bottom-row">
                    <div
                      className="hr-price-info"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <img
                        src={Dirham}
                        alt="Dirham"
                        style={{ width: '12px', height: '12px', verticalAlign: 'text-bottom' }}
                      />
                      {formatPrice(displayPrice)}
                      {sale && sale < regular && (
                        <>
                          <span className="hr-regular-price">{regular.toFixed(2)}</span>
                          <span className="hr-discount-badge">{discount}% OFF</span>
                        </>
                      )}
                    </div>

                    <button
                      className="hr-cart-btn"
                      onClick={() => handleAddToCart(prod)}
                      aria-label={`Add ${prod.name} to cart`}
                      disabled={isInCart}
                      title={isInCart ? 'Already in cart' : 'Add to cart'}
                    >
                      <img
                        src={isInCart ? AddedToCartIcon : AddCarticon}
                        alt={isInCart ? 'Added to cart' : 'Add to cart'}
                        className="hr-cart-icon"
                        draggable={false}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}

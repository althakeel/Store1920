import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // if you use react-router
// import cartIcon from '../assets/cart-icon.svg'; 
import '../assets/styles/related-products.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3/products';
const AUTH = {
  username: 'ck_8adb881aaff96e651cf69b9a8128aa5d9c80eb46',
  password: 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f',
};

function SkeletonCard() {
  return (
    <div className="hr-skeleton-card">
      <div className="hr-skeleton-image"></div>
      <div className="hr-skeleton-text"></div>
      <div className="hr-skeleton-text short"></div>
      <div className="hr-skeleton-bottom">
        <div className="hr-skeleton-price"></div>
        <div className="hr-skeleton-btn"></div>
      </div>
    </div>
  );
}

export default function HorizontalRelatedProducts({ productId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) return;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/${productId}`, { auth: AUTH });
        const relatedIds = res.data.related_ids || [];

        const relatedProds = await Promise.all(
          relatedIds.map((id) =>
            axios.get(`${API_BASE}/${id}`, { auth: AUTH }).then((r) => r.data)
          )
        );

        setRelatedProducts(relatedProds);
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
      setLoading(false);
    };

    fetchRelated();
  }, [productId]);

  const calcDiscount = (regular, sale) =>
    regular && sale ? Math.round(((regular - sale) / regular) * 100) : 0;

  const handleNavigate = (prod) => {
    navigate(`/product/${prod.slug || prod.id}`);
  };

  // Truncate product name to 25 chars + ...
  const truncateText = (text, maxLength = 25) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="horizontal-related-wrapper">
        <div className="horizontal-related-list">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts.length)
    return <p style={{ textAlign: 'center' }}>No related products found.</p>;

return (
  <div className="horizontal-related-wrapper">
    <h2
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'left',
        paddingLeft: 10,
      }}
    >
      Recommended for You
    </h2>
    <div className="horizontal-related-list">
      {relatedProducts.map((prod) => {
        const regular = parseFloat(prod.regular_price);
        const sale = parseFloat(prod.sale_price);
        const discount = calcDiscount(regular, sale);
        const image = prod.images?.[0]?.src;

        return (
          <div className="horizontal-related-card" key={prod.id}>
            <img
              src={image}
              alt={prod.name}
              className="hr-product-image"
              onClick={() => handleNavigate(prod)}
            />
            <div className="hr-card-info">
              <div
                className="hr-product-name"
                title={prod.name}
                onClick={() => handleNavigate(prod)}
              >
                {truncateText(prod.name, 25)}
              </div>
              <div className="hr-bottom-row">
                <div className="hr-price-info">
                  <span className="hr-sale-price">
                    {(sale || regular).toFixed(2)}
                  </span>
                  {sale && sale < regular && (
                    <>
                      <span className="hr-regular-price">
                        {regular.toFixed(2)}
                      </span>
                      <span className="hr-discount-badge">{discount}% OFF</span>
                    </>
                  )}
                </div>
                <button
                  className="hr-cart-btn"
                  onClick={() => alert(`Added "${prod.name}" to cart!`)}
                  aria-label={`Add ${prod.name} to cart`}
                >
                  <img
                    src="https://db.store1920.com/wp-content/uploads/2025/07/ADD-TO-CART-1.png"
                    alt=""
                    className="hr-cart-icon"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart } from 'react-icons/fi';
import '../assets/styles/CategoryProducts.css';

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('');

  const API_BASE = 'https://store1920.com/wp-json/wc/v3';
  const AUTH = {
    username: 'ck_c4e35c0d93df1f96cae81fccae967b8969a1eb85',
    password: 'cs_b2b2ab3b1cdbc7db01cd718dc52b8f5a5711a6e5',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(`${API_BASE}/products/categories`, { auth: AUTH });
        const category = categoryResponse.data.find((c) => c.slug === slug);
        if (!category) {
          setCategoryTitle('');
          setProducts([]);
          setLoading(false);
          return;
        }

        setCategoryTitle(category.name);

        const productsResponse = await axios.get(`${API_BASE}/products`, {
          auth: AUTH,
          params: { category: category.id, per_page: 100 },
        });

        setProducts(productsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const decodeText = (text) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  };

  const sortProductList = (list) => {
    if (sortType === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortType === 'low') return [...list].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortType === 'high') return [...list].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    return list;
  };

  const calculateDiscount = (regular, sale) => {
    if (!regular || !sale || parseFloat(regular) <= parseFloat(sale)) return null;
    const discount = 100 - (parseFloat(sale) / parseFloat(regular)) * 100;
    return `${Math.round(discount)}% OFF`;
  };

  const displayedProducts = sortProductList(products);

  return (
    <div className="custom-category-wrapper">
      <div className="custom-category-header">
        <h2 className="custom-category-title">{decodeText(categoryTitle)}</h2>
        <div className="custom-sort-dropdown">
          <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
            <option value="">Sort</option>
            <option value="name">Name (A–Z)</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="custom-grid-layout">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="custom-card skeleton" key={i}>
              <div className="skeleton-image" />
              <div className="skeleton-line" />
            </div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="custom-empty-message">
          <p>No products found in this category.</p>
        <div className="custom-empty-buttons">
  <button
    className="custom-empty-btn"
    onClick={() => (window.location.href = '/categories')}
  >
    Back to Categories
  </button>
  <button
    className="custom-empty-btn"
    onClick={() => (window.location.href = '/all-products')}
  >
    View All Products
  </button>
</div>

        </div>
      ) : (
        <div className="custom-grid-layout">
          {displayedProducts.map((product) => {
            const badges = product.best_seller_recommended_badges || [];
            const sale = parseFloat(product.sale_price);
            const regular = parseFloat(product.regular_price);
            const discount = calculateDiscount(regular, sale);

            return (
              <div className="custom-card" key={product.id}>
                <div className="custom-image-box">
                  <img
                    src={product.images[0]?.src || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="custom-product-image"
                  />
                </div>

                {badges.length > 0 && (
                  <div className="custom-badge-group">
                    {badges.map((badge) => (
                      <span key={badge} className={`custom-badge custom-badge-${badge}`}>
                        {badge.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="custom-product-title">
                  {decodeText(product.name.length > 25 ? product.name.slice(0, 25) + '…' : product.name)}
                </div>

                <div className="custom-footer-row">
                  <div className="custom-price-group">
                    {sale > 0 ? (
                      <>
                        <span className="custom-sale">AED {sale}</span>
                        <span className="custom-regular">AED {regular}</span>
                        {discount && <span className="custom-discount">{discount}</span>}
                      </>
                    ) : (
                      <span className="custom-sale">AED {regular || 'N/A'}</span>
                    )}
                  </div>
                  <FiShoppingCart className="custom-cart-icon" size={18} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;

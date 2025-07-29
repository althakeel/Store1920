import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import '../../../../assets/styles/myaccount/OrderSection.css';

const OrderSection = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const orderStatuses = [
    { label: 'All orders', value: '' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'completed' },
    { label: 'Returns', value: 'refunded' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      const wooCustomerId = user?.id || localStorage.getItem('userId');

      if (!wooCustomerId) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Call your backend proxy API, not WooCommerce directly
        const queryParams = new URLSearchParams({
          customer: wooCustomerId,
        });
        if (activeStatus) {
          queryParams.append('status', activeStatus);
        }

        const response = await fetch(`/api/orders?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        const data = await response.json();

        setOrders(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeStatus, user]);

  const getExpectedDeliveryDate = (order) => {
    const date = new Date(order.date_created);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString();
  };

  const handleProductClick = (slug) => navigate(`/product/${slug}`);

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');

  const isCancelable = (status) => ['processing', 'on-hold'].includes(status);

  return (
    <div className="order-section">
      <h3>Your Orders</h3>

      <div className="order-tabs">
        {orderStatuses.map(({ label, value }) => (
          <button
            key={value || 'all'}
            className={`tab-button ${activeStatus === value ? 'active' : ''}`}
            onClick={() => setActiveStatus(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {!loading && !error && orders.length > 0 && (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className={`order-item status-${order.status}`}>
              <div className="order-date">
                <strong>Order Date:</strong>{' '}
                {new Date(order.date_created).toLocaleDateString()}
              </div>

              <ul className="order-products-list">
                {order.line_items.map((item) => (
                  <li
                    key={item.id}
                    className="order-product"
                    onClick={() => handleProductClick(slugify(item.name))}
                    tabIndex={0}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleProductClick(slugify(item.name))
                    }
                    role="button"
                  >
                    <img
                      src={item.image?.src || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <div className="product-title">{item.name}</div>
                      <div className="product-price">
                        {order.currency || '$'}
                        {item.price}
                      </div>
                      <div className="expected-delivery">
                        Expected Delivery: {getExpectedDeliveryDate(order)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="order-actions">
                <button className="track-btn">Track Order</button>
                {isCancelable(order.status) && (
                  <button className="cancel-btn">Cancel Order</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderSection;

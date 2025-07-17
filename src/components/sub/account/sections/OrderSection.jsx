// File: OrderSection.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../assets/styles/myaccount/OrderSection.css';

const API_BASE = 'https://store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_8adb881aaff96e651cf69b9a8128aa5d9c80eb46';
const CONSUMER_SECRET = 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f';

const orderStatuses = [
  { label: 'All orders', value: '' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'completed' },
  { label: 'Returns', value: 'refunded' },
];

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          per_page: 20,
          orderby: 'date',
          order: 'desc',
        };
        if (activeStatus) params.status = activeStatus;

        const response = await axios.get(`${API_BASE}/orders`, {
          auth: {
            username: CONSUMER_KEY,
            password: CONSUMER_SECRET,
          },
          params,
        });

        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeStatus]);

  const getExpectedDeliveryDate = (order) => {
    const orderDate = new Date(order.date_created);
    const expectedDate = new Date(orderDate);
    expectedDate.setDate(orderDate.getDate() + 7);
    return expectedDate.toLocaleDateString();
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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
                <strong>Order Date:</strong> {new Date(order.date_created).toLocaleDateString()}
              </div>

              <ul className="order-products-list">
                {order.line_items.map((item) => (
                  <li
                    key={item.id}
                    className="order-product"
                    onClick={() => handleProductClick(slugify(item.name))}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={item.image?.src || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <div className="product-title">{item.name}</div>
                      <div className="product-price">
                        {order.currency || '$'}{item.price}
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
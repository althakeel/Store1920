import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

const buildUrl = (endpoint) =>
  `${API_BASE}/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}`;

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await axios.get(buildUrl(`orders/${orderId}`));
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="orderConfirmation">
      <h2>Thank you! Your order has been placed.</h2>
      <p>Expected delivery: 1–7 business days.</p>
      <p>Order Number: #{order.id}</p>

      <h3>Items:</h3>
      <ul>
        {order.line_items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — ${item.total}
          </li>
        ))}
      </ul>

      <p>
        <strong>Total Paid:</strong> ${order.total}
      </p>
    </div>
  );
}

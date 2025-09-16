import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../api/woocommerce"; // adjust path

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="orderConfirmation" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Thank you! Your order has been placed.</h2>
      <p>Expected delivery: 1–7 business days.</p>
      <p><strong>Order Number:</strong> #{order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <h3>Items:</h3>
      <ul>
        {order.line_items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — ${parseFloat(item.total).toFixed(2)}
          </li>
        ))}
      </ul>

      <p><strong>Subtotal:</strong> ${parseFloat(order.subtotal).toFixed(2)}</p>
      <p><strong>Total Paid:</strong> ${parseFloat(order.total).toFixed(2)}</p>

      {order.billing && (
        <>
          <h3>Billing Details:</h3>
          <p>{order.billing.first_name} {order.billing.last_name}</p>
          <p>{order.billing.address_1}, {order.billing.city}</p>
          <p>{order.billing.country}</p>
          <p>Email: {order.billing.email}</p>
          <p>Phone: {order.billing.phone}</p>
        </>
      )}

      {order.shipping && (
        <>
          <h3>Shipping Details:</h3>
          <p>{order.shipping.first_name} {order.shipping.last_name}</p>
          <p>{order.shipping.address_1}, {order.shipping.city}</p>
          <p>{order.shipping.country}</p>
        </>
      )}
    </div>
  );
}

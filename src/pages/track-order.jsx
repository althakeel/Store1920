import React, { useState } from "react";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_b56a66f53d1cb273b66097e1347cdfc7a49a4834";
const CONSUMER_SECRET = "cs_2ef308464511bd90cc976fbc04d65458d7b37d2f";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!orderId.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setOrderDetails(null);

    try {
      const url = `${API_BASE}/orders?search=${orderId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)}`,
        },
      });

      const data = await response.json();

      if (!data || data.length === 0) {
        setErrorMsg("Order not found. Please check after 2 hours.");
      } else {
        const order = data[0];
        setOrderDetails({
          id: order.id,
          status: order.status,
          shippingMethod: order.shipping_lines?.[0]?.method_title || "Standard",
          total: order.total,
          trackingUrl:
            order.meta_data?.find((m) => m.key === "_tracking_url")?.value || "#",
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to fetch order. Please check after 2 hours.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f7ff, #e8f0f4)",
        fontFamily: "Arial, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: "35px 25px",
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }} 
      >
        <h2 style={{ marginBottom: 20, color: "#1976d2" }}>
          📦 Track Your Order
        </h2>

        <input
          type="text"
          placeholder="Enter your Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 15px",
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 16,
            fontSize: 15,
            transition: "0.3s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
        />

        <button
          onClick={handleTrack}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: 16,
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#ff6a00",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            !loading && (e.currentTarget.style.backgroundColor = "#e65a00")
          }
          onMouseLeave={(e) =>
            !loading && (e.currentTarget.style.backgroundColor = "#ff6a00")
          }
        >
          {loading ? "Checking..." : "Track Order"}
        </button>

        {errorMsg && (
          <p style={{ marginTop: 14, color: "red", fontSize: 14 }}>
            {errorMsg}
          </p>
        )}

        {orderDetails && (
          <div
            style={{
              marginTop: 25,
              textAlign: "left",
              fontSize: 14,
              color: "#333",
              borderTop: "1px solid #eee",
              paddingTop: 15,
            }}
          >
            <p>
              <strong>Order ID:</strong> {orderDetails.id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {orderDetails.status}
              </span>
            </p>
            <p>
              <strong>Shipping Method:</strong> {orderDetails.shippingMethod}
            </p>
            <p>
              <strong>Total:</strong> {orderDetails.total}
            </p>
            <p>
              <strong>Tracking Link:</strong>{" "}
              <a
                href={orderDetails.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ff6a00", textDecoration: "underline" }}
              >
                View Shipment
              </a>
            </p>
          </div>
        )}

        <p style={{ marginTop: 20, fontSize: 12, color: "#888" }}>
          Note: Guests can track their orders. Updates will be sent via WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;

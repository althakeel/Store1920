import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");
  const [trackingId, setTrackingId] = useState(orderId || "");
  const [showPopup, setShowPopup] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleTrackOrder = () => {
    if (!trackingId) return;
    navigate(`/track-order?order_id=${trackingId}`);
  };

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(120deg, #fef9f9, #e0f7fa)",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "50px 35px",
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          textAlign: "center",
          transform: animate ? "scale(1)" : "scale(0.8)",
          opacity: animate ? 1 : 0,
          transition: "all 0.5s ease-out",
        }}
      >
        {/* Animated Success Icon */}
        <div
          style={{
            fontSize: 60,
            color: "#4caf50",
            marginBottom: 20,
            animation: "bounce 1s",
          }}
        >
          ✅
        </div>

        <h2
          style={{
            color: "#333",
            marginBottom: 16,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Order Placed Successfully!
        </h2>

        {orderId && (
          <p style={{ fontSize: 18, margin: "10px 0" }}>
            Your Order ID: <strong>#{orderId}</strong>
          </p>
        )}

        <p style={{ fontSize: 16, color: "#555", marginBottom: 30 }}>
          Thank you for shopping with us.
        </p>

        {/* Track Button */}
        <button
          onClick={handleTrackOrder}
          disabled={!trackingId}
          style={{
            padding: "14px 28px",
            fontSize: 16,
            fontWeight: "600",
            color: trackingId ? "#fff" : "#aaa",
            background: trackingId ? "linear-gradient(90deg, #ff9800, #ffb74d)" : "#eee",
            border: "none",
            borderRadius: 10,
            cursor: trackingId ? "pointer" : "not-allowed",
            boxShadow: trackingId ? "0 5px 15px rgba(255, 152, 0, 0.4)" : "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            trackingId && (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            trackingId && (e.currentTarget.style.transform = "scale(1)")
          }
        >
          Track Your Order
        </button>

        {/* Guest Notice */}
        {!user && (
          <p style={{ marginTop: 20, fontSize: 14, color: "#555" }}>
            Note: Guests can only track their order. Updates will be sent via WhatsApp.
          </p>
        )}
      </div>

      {/* Optional login popup can be added here if needed */}
    </div>
  );
}

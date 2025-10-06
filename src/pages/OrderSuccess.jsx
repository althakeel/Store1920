import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  const [animate, setAnimate] = useState(false);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    // ✅ if user manually opens this page or no order_id present
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }

    setAnimate(true);

    // ✅ Prevent going back entirely
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Push a dummy state and keep re-pushing if back is attempted
    blockBack();
    window.addEventListener("popstate", blockBack);

    // ✅ Auto redirect after countdown
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          navigate("/", { replace: true });
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("popstate", blockBack);
    };
  }, [navigate, orderId]);

  const handleTrackOrder = () => {
    if (orderId) navigate(`/track-order?order_id=${orderId}`);
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

        <button
          onClick={handleTrackOrder}
          style={{
            padding: "14px 28px",
            fontSize: 16,
            fontWeight: "600",
            color: "#fff",
            background: "linear-gradient(90deg, #ff9800, #ffb74d)",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(255, 152, 0, 0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Track Your Order
        </button>

        {!user && (
          <p style={{ marginTop: 20, fontSize: 14, color: "#555" }}>
            Note: Guests can only track their order. Updates will be sent via WhatsApp.
          </p>
        )}

        <p style={{ marginTop: 30, fontSize: 14, color: "#777" }}>
          You will be redirected to the homepage in{" "}
          <strong>{seconds}</strong> seconds...
        </p>
      </div>
    </div>
  );
}

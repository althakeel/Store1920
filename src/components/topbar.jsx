import React, { useState, useEffect, useRef } from "react";
import { FaTruck, FaClipboardCheck, FaMobileAlt } from "react-icons/fa";
import "../assets/styles/TopBar.css";

const ITEM_HEIGHT = 40;

const messages = [
  { icon: <FaTruck />, title: "Free Shipping", subtitle: "Special for you", link: "/free-shipping", color: "#28a745", type: "shipping" },
  { icon: <FaClipboardCheck />, title: "Delivery Guarantee", subtitle: "Refund for any issues", link: "/delivery-guarantee", color: "#ffc107", type: "returns" },
  { icon: <FaMobileAlt />, title: "Get the Store1920 App", subtitle: "Exclusive offers inside", link: "/get-app", color: "#007bff", type: "app" },
  { icon: <FaTruck />, title: "Fast Delivery", subtitle: "From UAE Warehouse", link: "/fast-delivery", color: "#17a2b8", type: "shipping" },
  { icon: <FaClipboardCheck />, title: "15-Day Returns", subtitle: "No questions asked", link: "/returns-policy", color: "#dc3545", type: "returns" },
  { icon: <FaMobileAlt />, title: "Special App Coupons", subtitle: "Extra discounts inside", link: "/app-coupons", color: "#6f42c1", type: "app" },
];

export default function TopBar() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [popup, setPopup] = useState(null);
  const slideRef = useRef(null);
  const totalMessages = messages.length;
  const loopMessages = [...messages, messages[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % (totalMessages + 1));
        setFading(false);
      }, 300);
    }, 3300);

    return () => clearInterval(interval);
  }, [totalMessages]);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = "transform 0.5s ease-in-out";
      slideRef.current.style.transform = `translateY(-${index * ITEM_HEIGHT}px)`;
    }
  }, [index]);

  const handlePopup = (item) => setPopup(item);
  const closePopup = () => setPopup(null);

  const renderPopupContent = () => {
    if (!popup) return null;

    switch (popup.type) {
      case "app":
        return (
          <>
            <h2>Get the Store1920 App</h2>
            <p>Enjoy exclusive features and discounts directly on your phone:</p>
            <ul className="popup-list">
              <li>📦 Track order status in real-time</li>
              <li>💬 24/7 Customer support</li>
              <li>🎉 Special app-only promotions</li>
              <li>🛒 Easy repeat orders with one click</li>
              <li>🔔 Instant notifications on deals</li>
            </ul>
            <div className="qr-section">
              {/* <img src="/qr-sample.png" alt="QR" className="qr-img" /> */}
              <div className="app-links">
                <button className="store-btn google">Google Play</button>
                <button className="store-btn apple">App Store</button>
              </div>
            </div>
          </>
        );

      case "returns":
        return (
          <>
            <h2>Delivery & Returns</h2>
            <p>We make shopping safe and easy:</p>
            <div className="info-box">
              <h3>Return Policy</h3>
              <p>• First return is free <br />• 15-day return window <br />• Products must be in original condition</p>
            </div>
            <div className="info-box">
              <h3>Refund Guarantee</h3>
              <p>• Refund issued to original payment method <br />• No questions asked <br />• Quick processing within 2-3 days</p>
            </div>
            <div className="info-box">
              <h3>Exchange Options</h3>
              <p>• Exchange for same or different product <br />• Shipping handled by us <br />• Easy tracking for exchanged orders</p>
            </div>
          </>
        );

      case "shipping":
        return (
          <>
            <h2>Shipping Info</h2>
            <p>Fast and reliable delivery from UAE warehouse:</p>
            <div className="info-box">
              <h3>Standard Delivery</h3>
              <p>• Free on orders over AED100 <br />• Estimated 2-5 business days <br />• Track your order in-app</p>
            </div>
            <div className="info-box">
              <h3>Fast Delivery</h3>
              <p>• Same-day delivery for selected items <br />• AED20 credit for late delivery <br />• Priority support for fast orders</p>
            </div>
            <div className="info-box">
              <h3>International Shipping</h3>
              <p>• Shipping worldwide <br />• Real-time tracking <br />• Custom duties and taxes handled</p>
            </div>
          </>
        );

      default:
        return <p>No details available</p>;
    }
  };

  return (
    <>
      <div className="topbar-wrapper">
        <div className="topbar-container">
          <div className="topbar-col clickable" style={{ color: messages[0].color }} onClick={() => handlePopup(messages[0])}>
            {messages[0].icon}
            <div className="text-box">
              <div className="title">{messages[0].title}</div>
              <div className="subtitle">{messages[0].subtitle}</div>
            </div>
          </div>

          <div className="pipe-divider"></div>

          <div className="topbar-center clickable" onClick={() => handlePopup(loopMessages[index])}>
            <div ref={slideRef} className={`slide-wrapper ${fading ? "fade" : ""}`}>
              {loopMessages.map((item, i) => (
                <div className="topbar-center-item" style={{ color: item.color }} key={i}>
                  {item.icon}
                  <div className="text-box">
                    <div className="title">{item.title}</div>
                    {item.subtitle && <div className="subtitle">{item.subtitle}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pipe-divider"></div>

          <div className="topbar-col clickable" style={{ color: messages[2].color }} onClick={() => handlePopup(messages[2])}>
            {messages[2].icon}
            <div className="text-box">
              <div className="title">{messages[2].title}</div>
            </div>
          </div>
        </div>
      </div>

      {popup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>✖</button>
            <div className="popup-body">{renderPopupContent()}</div>
            <div className="popup-footer">
              <button className="ok-btn" onClick={closePopup}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

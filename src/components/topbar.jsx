import React, { useState, useEffect } from "react";
import { FaTruck, FaClipboardCheck, FaGift } from "react-icons/fa";
import "../assets/styles/TopBar.css";
import { useCart } from '../contexts/CartContext';

export default function TopBar() {
  const [popup, setPopup] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const { isCartOpen, setIsCartOpen } = useCart();
  // Countdown (24 hours from now)
  useEffect(() => {
    const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const messages = [
    {
      icon: <FaTruck />,
      title: "Free Shipping",
      subtitle: "Special for you",
      color: "#28a745",
      type: "shipping",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Delivery Guarantee",
      subtitle: "Refund for any issues",
      color: "#ffc107",
      type: "returns",
    },
    {
      icon: <FaGift />,
      title: "Signup Rewards",
      subtitle: "100 Coins + Free Coupons",
      color: "#e63946",
      type: "signup",
    },
  ];

  const handlePopup = (item) => setPopup(item);
  const closePopup = () => setPopup(null);

  const renderPopupContent = () => {
    if (!popup) return null;

    switch (popup.type) {
      case "signup":
        return (
          <>
            <h2>🎁 Sign Up & Get Rewards</h2>
            <p>Join Store1920 today and claim your exclusive benefits:</p>
            <ul className="popup-list">
              <li>💰 <strong>100 Free Coins</strong> instantly</li>
              <li>🎟 <strong>Exclusive Coupons</strong> for your first order</li>
              <li>⚡ <strong>Limited-time Bonus</strong> if you sign up today</li>
            </ul>
            <div className="countdown-box">
              <p className="countdown-title">Offer ends in:</p>
              <div className="countdown-timer">
                <div>
                  <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                  <small>Hours</small>
                </div>
                <div>
                  <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <small>Min</small>
                </div>
                <div>
                  <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <small>Sec</small>
                </div>
              </div>
            </div>
          </>
        );
      case "returns":
        return (
          <>
            <h2>Delivery Guarantee</h2>
            <p>Shop with confidence — we’ve got you covered:</p>
            <ul className="popup-list">
              <li>✅ Refund issued within 2-3 days</li>
              <li>✅ 15-day easy return policy</li>
              <li>✅ Exchange options available</li>
            </ul>
          </>
        );
      case "shipping":
        return (
          <>
            <h2>Free Shipping</h2>
            <p>Enjoy fast and reliable delivery from our UAE warehouse:</p>
            <ul className="popup-list">
              <li>🚚 Free on orders over AED 100</li>
              <li>⚡ Same-day delivery available</li>
              <li>🌍 International shipping supported</li>
            </ul>
          </>
        );
      default:
        return <p>No details available</p>;
    }
  };

  return (
    <>
      <div className="topbar-wrapper"
        style={{
  width: isMobile ? "100%" : isCartOpen ? "calc(100% - 250px)" : "100%",
  transition: "width 0.3s ease",
}}>
        <div className="topbar-container">
          {/* Left Item */}
          <div
            className="topbar-col clickable"
            style={{ color: messages[0].color }}
            onClick={() => handlePopup(messages[0])}
          >
            {messages[0].icon}
            <div className="text-box">
              <div className="title">{messages[0].title}</div>
              <div className="subtitle">{messages[0].subtitle}</div>
            </div>
          </div>

          <div className="pipe-divider"></div>

          {/* Center Countdown */}
          <div className="topbar-center">
            <span className="countdown-text">⏳ Hurry Up! Sale ends in</span>
            <span className="timer">
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>

          <div className="pipe-divider"></div>

          {/* Right Item */}
          <div
            className="topbar-col clickable"
            style={{ color: messages[2].color }}
            onClick={() => handlePopup(messages[2])}
          >
            {messages[2].icon}
            <div className="text-box">
              <div className="title">{messages[2].title}</div>
              <div className="subtitle">{messages[2].subtitle}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
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

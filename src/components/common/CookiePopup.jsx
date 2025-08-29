import React, { useState, useEffect } from "react";

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lastClosed = localStorage.getItem("cookiePopupClosed");
    const skipPopup = sessionStorage.getItem("skipCookiePopup");
    const now = new Date().getTime();

    if (!skipPopup && (!lastClosed || now - lastClosed > 30 * 60 * 1000)) {
      setShowPopup(true);
    }
  }, []);

  const handleContinue = () => {
    setShowPopup(false);
    localStorage.setItem("cookiePopupClosed", new Date().getTime());
  };

  const handleClearCookies = () => {
    setShowPopup(false);
    sessionStorage.setItem("skipCookiePopup", "true");

    setTimeout(() => {
      // --- Keys we want to preserve ---
      const preservedKeys = [
        "userToken",          // login/session
        "userId",             // login/session
        "isLoggedIn",         // login/session
        "lastClickedProduct", // last clicked product
        "categories"          // stored categories
      ];

      let preservedData = {};
      preservedKeys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) preservedData[key] = value;
      });

      // --- Clear cookies ---
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // --- Clear localStorage, then restore preserved data ---
      localStorage.clear();
      Object.keys(preservedData).forEach((key) => {
        localStorage.setItem(key, preservedData[key]);
      });

      // --- Reload ---
      window.location.reload();
    }, 50);
  };

  if (!showPopup) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "linear-gradient(90deg, #111, #222)",
        color: "#fff",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        zIndex: 9999,
        boxShadow: "0 -4px 15px rgba(0,0,0,0.4)",
        animation: "slideUp 0.4s ease",
      }}
    >
      <span style={{ fontWeight: "600", textAlign: "center" }}>
        We use cookies to improve your experience. Do you want to keep them or clear?
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleContinue}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "2px solid #fff",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            minWidth: "120px",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#fff";
          }}
        >
          Continue
        </button>
        <button
          onClick={handleClearCookies}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            background: "#ff4d4d",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            minWidth: "120px",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Clear Cookies
        </button>
      </div>

      {/* Slide up animation */}
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @media (max-width: 480px) {
            div[style*="position: fixed"] {
              font-size: 14px !important;
              padding: 15px !important;
            }
            button {
              min-width: 100px !important;
              padding: 8px 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CookiePopup;

import React, { useState, useEffect } from "react";

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lastClosed = localStorage.getItem("cookiePopupClosed");
    const now = new Date().getTime();

    // Show popup if not closed before or 30 min passed
    if (!lastClosed || now - lastClosed > 30 * 60 * 1000) {
      setShowPopup(true);
    }
  }, []);

  const handleContinue = () => {
    setShowPopup(false);
    localStorage.setItem("cookiePopupClosed", new Date().getTime());
  };

  const handleClearCookies = () => {
    // Close popup immediately
    setShowPopup(false);

    // Save current timestamp to prevent reopening
    localStorage.setItem("cookiePopupClosed", new Date().getTime());

    // Clear cookies and storage
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    localStorage.clear();
    sessionStorage.clear();

    // Reload page after clearing
    window.location.reload();
  };

  if (!showPopup) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "600px",
        backgroundColor: "rgba(0,0,0,0.9)",
        color: "#fff",
        padding: "20px 25px",
        borderRadius: "14px",
        boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        backdropFilter: "blur(5px)",
        zIndex: 9999,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <span style={{ fontWeight: "600", textAlign: "center" }}>
        We use cookies to improve your experience. Would you like to keep them or clear?
      </span>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={handleContinue}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#fff",
            color: "#000",
            cursor: "pointer",
            fontWeight: "600",
            minWidth: "120px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
        >
          Continue
        </button>
        <button
          onClick={handleClearCookies}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#fff",
            color: "#000",
            cursor: "pointer",
            fontWeight: "600",
            minWidth: "120px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
        >
          Clear Cookies
        </button>
      </div>
    </div>
  );
};

export default CookiePopup;

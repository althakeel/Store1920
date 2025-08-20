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
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    localStorage.clear();
    sessionStorage.clear();

    window.location.reload();
  };

  if (!showPopup) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        backgroundColor: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "15px 20px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        zIndex: 9999,
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "300px",
        fontSize: "14px",
        backdropFilter: "blur(5px)",
      }}
    >
      <span style={{ fontWeight: "500" }}>
        Do you want to continue with old cookies or clear them?
      </span>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
          onClick={handleContinue}
          style={{
            padding: "7px 12px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#1abc9c",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "500",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#16a085")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1abc9c")}
        >
          Continue
        </button>
        <button
          onClick={handleClearCookies}
          style={{
            padding: "7px 12px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#e74c3c",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "500",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
        >
          Clear Cookies
        </button>
      </div>
    </div>
  );
};

export default CookiePopup;

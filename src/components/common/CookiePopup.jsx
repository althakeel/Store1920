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
      const preservedKeys = [
        "userToken",
        "userId",
        "isLoggedIn",
        "lastClickedProduct",
        "categories",
      ];

      let preservedData = {};
      preservedKeys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) preservedData[key] = value;
      });

      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(
            /=.*/,
            "=;expires=" + new Date().toUTCString() + ";path=/"
          );
      });

      localStorage.clear();
      Object.keys(preservedData).forEach((key) => {
        localStorage.setItem(key, preservedData[key]);
      });

      window.location.reload();
    }, 50);
  };

  if (!showPopup) return null;

  return (
    <div className="cookie-popup">
      <span className="cookie-text">
        We use cookies to improve your experience. Do you want to keep them or
        clear?
      </span>

      <div className="cookie-buttons">
        <button className="btn-continue" onClick={handleContinue}>
          Continue
        </button>
        <button className="btn-clear" onClick={handleClearCookies}>
          Clear Cookies
        </button>
      </div>

      <style>
        {`
          .cookie-popup {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, #111, #222);
            color: #fff;
            padding: 18px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-family: Arial, sans-serif;
            font-size: 15px;
            z-index: 9999;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.4);
            animation: slideUp 0.4s ease;
          }

          .cookie-text {
            font-weight: 600;
            text-align: center;
          }

          .cookie-buttons {
            display: flex;
            justify-content: center;
            gap: 14px;
            flex-wrap: wrap;
          }

          .btn-continue {
            padding: 10px 20px;
            border-radius: 6px;
            border: 2px solid #fff;
            background: transparent;
            color: #fff;
            cursor: pointer;
            font-weight: 600;
            min-width: 120px;
            transition: all 0.3s;
          }
          .btn-continue:hover {
            background: #fff;
            color: #000;
          }

          .btn-clear {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            background: #ff4d4d;
            color: #fff;
            cursor: pointer;
            font-weight: 600;
            min-width: 120px;
            transition: all 0.3s;
          }
          .btn-clear:hover {
            opacity: 0.8;
          }

          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @media (max-width: 480px) {
            .cookie-popup {
              font-size: 14px !important;
              padding: 15px !important;
            }
            .btn-continue,
            .btn-clear {
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

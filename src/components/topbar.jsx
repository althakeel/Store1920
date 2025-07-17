import React, { useEffect, useState, useRef } from 'react';
import '../assets/styles/TopBar.css';
import { FaTruck, FaClipboardCheck, FaMobileAlt } from 'react-icons/fa';

const messages = [
  {
    icon: <FaTruck />,
    title: "Free shipping",
    subtitle: "Special for you",
    link: "/free-shipping",
    color: "#8fff8f",
  },
  {
    icon: <FaClipboardCheck />,
    title: "Delivery guarantee",
    subtitle: "Refund for any issues",
    link: "/delivery-guarantee",
    color: "#ffff99",
  },
  {
    icon: <FaMobileAlt />,
    title: "Get the Store1920 App",
    subtitle: "",
    link: "/get-app",
    color: "#ffff99",
  },
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    subtitle: "From UAE Warehouse",
    link: "/fast-delivery",
    color: "#8fff8f",
  },
  {
    icon: <FaClipboardCheck />,
    title: "15-Day Returns",
    subtitle: "No questions asked",
    link: "/returns-policy",
    color: "#ffd700",
  },
  {
    icon: <FaMobileAlt />,
    title: "Special App Coupons",
    subtitle: "Extra discounts inside",
    link: "/app-coupons",
    color: "#ffa500",
  },
];

export default function TopBar() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const slideRef = useRef(null);
  const ITEM_HEIGHT = 35;
  const totalMessages = messages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setFading(false);
      }, 300); // fade duration
    }, 3300); // interval slightly longer than fade duration

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index > totalMessages) {
      if (slideRef.current) {
        slideRef.current.style.transition = 'none';
        slideRef.current.style.transform = `translateY(0px)`;
      }
      setTimeout(() => {
        setIndex(0);
        if (slideRef.current) {
          slideRef.current.style.transition = 'transform 0.5s ease-in-out';
        }
      }, 50);
    }
  }, [index, totalMessages]);

  const loopMessages = [...messages, messages[0]];

  return (
    <div className="topbar-wrapper">
      <div className="topbar-container">
        {/* Left Item */}
        <a href={messages[0].link} className="topbar-col" style={{ color: messages[0].color }}>
          {messages[0].icon}
          <div className="text-box">
            <div className="title">{messages[0].title}</div>
            <div className="subtitle">{messages[0].subtitle}</div>
          </div>
        </a>

        {/* Center Rotating */}
        <div className="topbar-center">
          <div
            ref={slideRef}
            className={`slide-wrapper ${fading ? 'fade' : ''}`}
            style={{ transform: `translateY(-${index * ITEM_HEIGHT}px)` }}
          >
            {loopMessages.map((item, i) => (
              <a
                href={item.link}
                className="topbar-center-item"
                style={{ color: item.color }}
                key={i}
              >
                {item.icon}
                <div className="text-box">
                  <div className="title">{item.title}</div>
                  {item.subtitle && <div className="subtitle">{item.subtitle}</div>}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Item */}
        <a href={messages[2].link} className="topbar-col" style={{ color: messages[2].color }}>
          {messages[2].icon}
          <div className="text-box">
            <div className="title">{messages[2].title}</div>
          </div>
        </a>
      </div>
    </div>
  );
}

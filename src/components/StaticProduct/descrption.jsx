import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";

const Description = ({ product }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!product) return null;

  const sections = [
    {
      title: "Description",
      content: (
        <div style={{ marginLeft: "10px" }}>
          <li style={{ listStyle: "none" }}>{product.description}</li>
          <ul style={{ margin: "0", paddingLeft: "18px" }}>
            <li>{product.subdesc}</li>
            <li>{product.subdesc2}</li>
            <li>{product.subdesc3}</li>
            <li>{product.subdesc4}</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Processing & Shipping",
      content:
        "We offer Free Express Shipping on all orders! Please allow 1-2 Business Days for us to process and ship your order. Estimated Arrival Time: 7-12 business days.",
    },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: "20px 0" }}>
      {sections.map((sec, i) => (
        <div
          key={i}
          style={{
            borderBottom: "1px solid #ddd",
            marginBottom: "10px",
          }}
        >
          {/* Header */}
          <button
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {sec.title}
            {/* Proper Font Awesome Arrow */}
            <FontAwesomeIcon
              icon={openIndex === i ? faAngleDown : faAngleRight}
              style={{ fontSize: "18px", color: "#333" }}
            />
          </button>

          {/* Content */}
          {openIndex === i && (
            <div
              style={{
                padding: "0 12px 12px",
                fontSize: "14px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              {typeof sec.content === "string" ? <p>{sec.content}</p> : sec.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Description;

import React, { useState } from "react";

const ProductFAQ = ({ product }) => {
  const faqs = [
    { q: product.Faq1Q, a: product.fAQ1A },
    { q: product.Faq2Q, a: product.fAQ2A },
    { q: product.Faq3Q, a: product.fAQ3A },
  ].filter((f) => f.q);

  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs.length) return null;

  const sectionStyle = {
    width: "100%",
    backgroundColor: "#f9f6f3", // full-width background
    padding: "60px 0",
  };

  const containerStyle = {
    maxWidth: "1400px", // content max width
    margin: "0 auto",
    padding: "0 24px",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "32px",
  };

  const faqItemStyle = {
    borderBottom: "1px solid #ddd",
    padding: "16px 0",
    cursor: "pointer",
  };

  const questionStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "500",
  };

  const answerWrapperStyle = (isOpen) => ({
    maxHeight: isOpen ? "500px" : "0px",
    overflow: "hidden",
    transition: "max-height 0.4s ease",
  });

  const answerStyle = {
    marginTop: "12px",
    color: "#555",
    lineHeight: "1.6",
  };

  return (
    <div style={sectionStyle}>
      <div style={containerStyle}>
        {/* Title */}
        <h2 style={titleStyle}>Questions? We’ve Got You Covered</h2>

        {/* FAQ List */}
        <div>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={faqItemStyle}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {/* Question */}
              <div style={questionStyle}>
                <span>{faq.q}</span>
<span>{openIndex === idx ? "▲" : "▼"}</span> 
              </div>

              {/* Answer with smooth expand */}
              <div style={answerWrapperStyle(openIndex === idx)}>
                <p style={answerStyle}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFAQ;

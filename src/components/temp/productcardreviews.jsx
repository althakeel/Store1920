import React from 'react';

export default function ProductCardReviews() {
  const reviews = Math.floor(Math.random() * 200) + 20;   // 20 to 220
  const rating = (Math.random() * 2 + 3).toFixed(1);      // 3.0 to 5.0
  const sold = Math.floor(Math.random() * 150) + 10;      // 10 to 160

  const starsArray = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return 'full';
    if (i === Math.floor(rating) && !Number.isInteger(rating)) return 'half';
    return 'empty';
  });

  const renderStar = (type, index) => {
    const commonProps = { key: index, width: 14, height: 14, viewBox: '0 0 24 24', strokeWidth: 2 };
    switch (type) {
      case 'full':
        return (
          <svg {...commonProps} fill="#ffcc00" stroke="#ffcc00">
            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.176L12 18.896l-7.336 3.853 1.402-8.176-5.934-5.782 8.2-1.193z" />
          </svg>
        );
      case 'half':
        return (
          <svg {...commonProps} fill="url(#halfGrad)" stroke="#ffcc00">
            <defs>
              <linearGradient id="halfGrad">
                <stop offset="50%" stopColor="#ffcc00" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.176L12 18.896l-7.336 3.853 1.402-8.176-5.934-5.782 8.2-1.193z" />
          </svg>
        );
      default:
        return (
          <svg {...commonProps} fill="none" stroke="#ccc">
            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.176L12 18.896l-7.336 3.853 1.402-8.176-5.934-5.782 8.2-1.193z" />
          </svg>
        );
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12,
    color: '#333',
    gap: 4,
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  };

  const soldStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  };

  const verifiedStyle = {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '1px 6px',
    borderRadius: 3,
    fontWeight: 'bold',
    fontSize: 10,
    display: 'inline-block',
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <span style={{ fontWeight: 'bold', fontSize: 12 }}>{rating}</span>
        <div style={{ display: 'flex', gap: 2 }}>{starsArray.map(renderStar)}</div>
        <span style={{ color: '#777', fontSize: 12 }}>({reviews})</span>
        <span style={{ fontSize: 12 }}>{sold} sold</span>

      </div>
      {/* <div style={soldStyle}>
        <span style={{ fontSize: 12 }}>{sold} sold</span>
        {rating >= 4 && <span style={verifiedStyle}>Verified Customer</span>}
      </div> */}

      {/* Mobile responsive adjustments */}
      <style>
        {`
          @media (max-width: 480px) {
            div[style*="flex-direction: column"] {
              font-size: 10px;
              gap: 3px;
            }
            span[style*="font-weight: bold"] {
              font-size: 10px;
            }
            div[style*="gap: 2px"] svg {
              width: 12px !important;
              height: 12px !important;
            }
            span[style*="Verified Customer"] {
              font-size: 8px !important;
              padding: 0 4px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

import React from 'react';

// Badge labels and styles
const BADGE_MAP = {
  below_price: {
    label: 'Below Comparable Price',
    style: { backgroundColor: '#ff9800', color: '#fff' },
  },
  almost_sold: {
    label: 'Almost Sold Out',
    style: { backgroundColor: '#e60023', color: '#fff' },
  },
  limited_time: {
    label: 'Limited Time Offer',
    style: { backgroundColor: '#0071e3', color: '#fff' },
  },
  lower_than_usual: {
    label: 'Price Lower Than Usual',
    style: { backgroundColor: '#009688', color: '#fff' },
  },
  best_recommended: {
    label: 'Best Recommended',
    style: { backgroundColor: '#4caf50', color: '#fff' },
  },
};

export default function SellerBadges({ badges }) {
  if (!Array.isArray(badges) || badges.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '10px' }}>
      {badges.map((badge) => {
        const badgeData = BADGE_MAP[badge];
        if (!badgeData) return null;

        return (
          <span
            key={badge}
            style={{
              padding: '2px 5px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              ...badgeData.style,
            }}
          >
            {badgeData.label}
          </span>
        );
      })}
    </div>
  );
}

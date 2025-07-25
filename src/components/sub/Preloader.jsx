// ./components/sub/Preloader.jsx
import React from 'react';

export default function Preloader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          border: '6px solid #eee',
          borderTop: '6px solid #0aa6ee',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

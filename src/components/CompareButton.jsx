import React from 'react';
import { useCompare } from '../contexts/CompareContext';
import { useNavigate } from 'react-router-dom';

const CompareButton = ({ productId }) => {
  const { addToCompare } = useCompare();
  const navigate = useNavigate();

  const handleCompare = () => {
    addToCompare(productId);
    navigate('/compare');
  };

  return (
    <button
      onClick={handleCompare}
      style={{
        padding: '6px 12px',
        fontSize: '14px',
        background: '#ff6600',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
      }}
    >
      Compare
    </button>
  );
};

export default CompareButton;

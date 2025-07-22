// src/components/sub/SignOutConfirmModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import '../../assets/styles/SignOutConfirmModal.css'; // optional CSS for modal styling

const SignOutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h3>Confirm Sign Out</h3>
        <p>Are you sure you want to sign out?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} type="button">Yes, Sign Out</button>
          <button onClick={onCancel} type="button">Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignOutConfirmModal;
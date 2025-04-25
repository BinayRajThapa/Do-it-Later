import React, { useEffect } from 'react';
import './Modals.scss';

const CustomModal = ({ show, onClose, children }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-backdrop" onClick={onClose} />
      <div className="custom-modal-container">
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
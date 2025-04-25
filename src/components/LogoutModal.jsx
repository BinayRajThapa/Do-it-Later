import React from 'react';
import CustomModal from './CustomModal';
import './Modals.scss';

const LogoutModal = ({ show, onHide, onConfirm }) => {
  return (
    <CustomModal show={show} onClose={onHide}>
      <div className="logout-modal">
        <div className="modal-header logout-header">
          <h3 className="modal-title">Confirm Logout</h3>
          <button className="modal-close-btn" onClick={onHide}>×</button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to log out?</p>
        </div>

        <div className="modal-footer">
          <button className="modal-btn btn-secondary" onClick={onHide}>Cancel</button>
          <button className="modal-btn btn-danger" onClick={onConfirm}>Log Out</button>
        </div>
      </div>
    </CustomModal>
  );
};

export default LogoutModal;

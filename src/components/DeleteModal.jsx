import React from 'react';
import CustomModal from './CustomModal';

const DeleteModal = ({
  show,
  onHide,
  onConfirm,
  customText,
  customTitle
}) => {
  return (
    <CustomModal show={show} onClose={onHide}>
      <div className="delete-confirm-modal">
      <div className="modal-header delete-confirm">
          <h3 className="modal-title">{customTitle || 'Confirm Deletion'}</h3>
          <button onClick={onHide} className="modal-close-btn">×</button>
        </div>

        <div className="modal-body">
          <p>{customText || 'Are you sure you want to delete the selected tasks?'}</p>
        </div>

        <div className="modal-footer">
          <button className="modal-btn btn-secondary" onClick={onHide}>
            Cancel
          </button>
          <button className="modal-btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteModal;

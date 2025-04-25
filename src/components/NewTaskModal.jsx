import React, { useState } from 'react';
import CustomModal from './CustomModal';
import './NewTaskModal.scss';

const NewTaskModal = ({ show, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <CustomModal show={show} onClose={onClose}>
      <div className="new-task-modal">
        <div className="modal-header new-task-header">
          <h3 className="modal-title">Add New Task</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Task title..."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
              rows="3"
            />
          </div>

          <div className="form-group priority-group">
            <label>Priority</label>
            <div className="priority-options">
              {['high', 'medium', 'low'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`priority-btn ${priority === level ? 'active' : ''}`}
                  data-priority={level}
                  onClick={() => setPriority(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="submit-btn"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default NewTaskModal;

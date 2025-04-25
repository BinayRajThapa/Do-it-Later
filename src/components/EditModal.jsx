import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomModal from './CustomModal';
import './Modals.scss';

const EditModal = ({
  show,
  onHide,
  onConfirm,
  taskIndex,
  editedTask,
  setEditedTask
}) => {
  const tasks = useSelector(state => state.tasks);
  const task = tasks[taskIndex];

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "medium"
      });
    }
  }, [task, setEditedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriorityChange = (priority) => {
    setEditedTask(prev => ({
      ...prev,
      priority
    }));
  };

  return (
    <CustomModal show={show} onClose={onHide}>
      <div className="edit-modal">
        <div className="modal-header modal-header-edit">
          <h3 className="modal-title">Edit Task</h3>
          <button className="modal-close-btn" onClick={onHide}>×</button>
        </div>

        <div className="modal-body modal-body-edit">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              required
              placeholder="Task title..."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
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
                  className={`priority-btn ${editedTask.priority === level ? 'active' : ''}`}
                  data-priority={level}
                  onClick={() => handlePriorityChange(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer modal-footer-edit">
          <button className="modal-btn btn-secondary" onClick={onHide}>Cancel</button>
          <button
            className="modal-btn btn-primary"
            onClick={onConfirm}
            disabled={!editedTask.title.trim()}
          >
            Save Changes
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default EditModal;

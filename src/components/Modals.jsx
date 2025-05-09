import React, { useState, useEffect, useCallback } from 'react';

 import './Modals.scss';
 import { useSelector } from 'react-redux';
 

 const Modals = ({
  type,
  show,
  onClose,
  onConfirm,
  taskIndex,
  editedTask,
  setEditedTask,
  onSubmitNewTask,
 }) => {
  const tasks = useSelector((state) => state.tasks);
  const task = taskIndex !== undefined ? tasks[taskIndex] : null;
 

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For error handling
 

  useEffect(() => {
  if (type === 'edit' && task) {
  setEditedTask({
  title: task?.title || '',
  description: task?.description || '',
  priority: task?.priority || 'medium',
  dueDate: task?.dueDate || ''
  });
  }
  }, [type, task, setEditedTask]);
 

  useEffect(() => {
  if (type === 'new') {
  setNewTitle('');
  setNewDescription('');
  setNewPriority('medium');
  setNewDueDate('');
  setErrorMessage(''); // Clear any previous errors
  }
  }, [type, show]);
 

  const handleEditChange = useCallback((e) => {
  const { name, value } = e.target;
  setEditedTask((prev) => ({
  ...prev,
  [name]: value,
  }));
  }, [setEditedTask]);
 

  const handlePriorityChange = useCallback((priority) => {
  if (type === 'edit') {
  setEditedTask((prev) => ({
  ...prev,
  priority,
  }));
  } else if (type === 'new') {
  setNewPriority(priority);
  }
  }, [type, setEditedTask]);
 

  const resetForm = useCallback(() => {  // Declared BEFORE handleNewSubmit
  setNewTitle('');
  setNewDescription('');
  setNewPriority('medium');
  setNewDueDate('');
  }, []);
 

  const handleNewSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onSubmitNewTask({
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        dueDate: newDueDate || null,
      });
      resetForm();
      onClose();
    } catch (error) {
      setErrorMessage('Could not add task. Please try again.');
    } finally {
      setIsSubmitting(false); 
    }
  }, [newTitle, newDescription, newPriority, newDueDate, onSubmitNewTask, onClose, resetForm]);
 

  const modalConfig = {
  new: {
  header: 'Add New Task',
  body: () => (
  <form onSubmit={handleNewSubmit}>
  {errorMessage && <p className="error-message">{errorMessage}</p>}
  <div className="form-group">
  <label>Title*</label>
  <input
  type="text"
  value={newTitle}
  onChange={(e) => setNewTitle(e.target.value)}
  required
  placeholder="Task title..."
  />
  </div>
  <div className="form-group">
  <label>Description</label>
  <textarea
  value={newDescription}
  onChange={(e) => setNewDescription(e.target.value)}
  placeholder="Task details..."
  rows="3"
  />
  </div>
  <div className="form-group">
  <label>Due Date</label>
  <input
  type="date"
  value={newDueDate}
  onChange={(e) => setNewDueDate(e.target.value)}
  />
  </div>
  <div className="form-group priority-group">
  <label>Priority</label>
  <div className="priority-options">
  {['high', 'medium', 'low'].map((level) => (
  <button
  key={level}
  type="button"
  className={`priority-btn ${newPriority === level ? 'active' : ''}`}
  data-priority={level}
  onClick={() => handlePriorityChange(level)}
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
  disabled={!newTitle.trim() || isSubmitting}
  >
  {isSubmitting ? 'Adding...' : 'Add Task'}
  </button>
  </div>
  </form>
  ),
  },
  edit: {
  header: 'Edit Task',
  body: () => (
  <>
  <div className="form-group">
  <label>Title</label>
  <input
  type="text"
  name="title"
  value={editedTask.title}
  onChange={handleEditChange}
  required
  placeholder="Task title..."
  />
  </div>
  <div className="form-group">
  <label>Description</label>
  <textarea
  name="description"
  value={editedTask.description}
  onChange={handleEditChange}
  placeholder="Task details..."
  rows="3"
  />
  </div>
  <div className="form-group">
  <label>Due Date</label>
  <input
  type="date"
  name="dueDate"
  value={editedTask.dueDate || ''}
  onChange={handleEditChange}
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
  </>
  ),
  footer: () => (
  <>
  <button className="modal-btn btn-secondary" onClick={onClose}>Cancel</button>
  <button
  className="modal-btn btn-primary"
  onClick={onConfirm}
  disabled={!editedTask.title.trim()}
  >
  Save Changes
  </button>
  </>
  ),
  },
  delete: {
  header: 'Confirm Deletion',
  body: () => <p>Are you sure you want to delete the selected tasks?</p>,
  footer: () => (
  <>
  <button className="modal-btn btn-secondary" onClick={onClose}>Cancel</button>
  <button className="modal-btn btn-danger" onClick={onConfirm}>Delete</button>
  </>
  ),
  },
  logout: {
  header: 'Confirm Logout',
  body: () => <p>Are you sure you want to log out?</p>,
  footer: () => (
  <>
  <button className="modal-btn btn-secondary" onClick={onClose}>Cancel</button>
  <button className="modal-btn btn-danger" onClick={onConfirm}>Log Out</button>
  </>
  ),
  },
  };
 

  if (!show) return null;
 

  const config = modalConfig[type];
 

  return (
  <div className="custom-modal-overlay">
  <div className="custom-modal-backdrop" onClick={onClose} />
  <div className={`custom-modal-container generic-modal ${type}`}>
  <div className={`modal-header ${type}`}>
  <h3 className="modal-title">{config?.header}</h3>
  <button className="modal-close-btn" onClick={onClose}>×</button>
  </div>
  <div className="modal-body">{config?.body?.()}</div>
  {type !== 'new' && config?.footer && (
  <div className="modal-footer">{config.footer()}</div>
  )}
  </div>
  </div>
  );
 };
 

 export default Modals;
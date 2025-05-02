import React, { useState, useEffect, useCallback } from 'react';
import './Modals.scss'; 
import { useSelector } from 'react-redux';

const Modal = ({
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

    useEffect(() => {
        if (type === 'edit' && task) {
            setEditedTask({
                title: task?.title || '',
                description: task?.description || '',
                priority: task?.priority || 'medium',
            });
        }
    }, [type, task, setEditedTask]);

    useEffect(() => {
        if (type === 'new') {
            setNewTitle('');
            setNewDescription('');
            setNewPriority('medium');
            setErrorMessage('');
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
    }, [type, setEditedTask, setNewPriority]);

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
            });
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error adding task:', error);
            setErrorMessage('Could not add task. Please try again.');
        }
    }, [newTitle, newDescription, newPriority, onSubmitNewTask, onClose]);

    const renderHeader = () => {
        if (type === 'delete') return 'Confirm Deletion';
        if (type === 'edit') return 'Edit Task';
        if (type === 'logout') return 'Confirm Logout';
        if (type === 'new') return 'Add New Task';
    };

    const renderBody = () => {
        if (type === 'delete') {
            return <p>Are you sure you want to delete the selected tasks?</p>;
        }
        if (type === 'logout') {
            return <p>Are you sure you want to log out?</p>;
        }
        if (type === 'edit') {
            return (
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
            );
        }
        if (type === 'new') {
            return (
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
            );
        }
    };

    const renderFooter = () => {
        if (type === 'edit') {
            return (
                <>
                    <button className="modal-btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="modal-btn btn-primary"
                        onClick={onConfirm}
                        disabled={!editedTask.title.trim()}
                    >
                        Save Changes
                    </button>
                </>
            );
        }
        if (type === 'delete') {
            return (
                <>
                    <button className="modal-btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-btn btn-danger" onClick={onConfirm}>
                        Delete
                    </button>
                </>
            );
        }
        if (type === 'logout') {
            return (
                <>
                    <button className="modal-btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-btn btn-danger" onClick={onConfirm}>
                        Log Out
                    </button>
                </>
            );
        }
        return null;
    };

    if (!show) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-backdrop" onClick={onClose} />
            <div className={`custom-modal-container generic-modal ${type}`}>
                <div className={`modal-header ${type}`}>
                    <h3 className="modal-title">{renderHeader()}</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {renderBody()}
                </div>

                {type !== 'new' && (
                    <div className="modal-footer">
                        {renderFooter()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
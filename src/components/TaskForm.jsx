import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { addTask } from '../store/tasksSlice';
import NewTaskModal from './NewTaskModal';
import './TaskForm.scss';


const TaskForm = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const { user } = useSelector(state => state.auth); 

  const handleSubmit = (taskData) => {
    if (!taskData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
  
    dispatch(addTask({
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      priority: taskData.priority || 'medium',
      status: "todo",
      tags: [],
      owner: user.email
    }));
  };


  return (
    <header className="app_header">
      <div className="todo_header">
        <h1>Do it Later 😉</h1>
      </div>
      
      <button 
        className="add-task-btn"
        onClick={() => setShowModal(true)}
        aria-label="Add new task"
      >
        + Add New Task
      </button>

      <NewTaskModal 
        show={showModal}
        onClose={() => {
          console.log('Closing Modal');
          setShowModal(false);
        }}
        onSubmit={handleSubmit}
      />
    </header>
  );
};

export default TaskForm;
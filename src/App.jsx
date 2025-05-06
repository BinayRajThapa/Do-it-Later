import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';
import { updateTasks, deleteTask } from './store/tasksSlice';
import TaskForm from "./components/TaskForm";
import TaskColumn from "./components/TaskColumn";
import AuthForm from "./components/AuthForm";
import Modals from './components/Modals';  
import UserDropdown from "./components/UserDropdown";
import { authService } from "./utils/auth";
import "./App.scss";
import toast, { Toaster } from "react-hot-toast";
import confetti from 'canvas-confetti';
import './styles/main.scss';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector(state => state.tasks);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [activeCard, setActiveCard] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: "", description: "", priority: "medium" });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [originalText, setOriginalText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [authError, setAuthError] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const [showNewTaskModal, setShowNewTaskModal] = useState(false); // New task modal control

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 1500,
      spread: 1000,
      origin: { y: 0.6 },
      colors: ['#6457f9', '#7c4dff', '#4a6baf', '#e6a23c', '#67c23a']
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (['/login', '/signup'].includes(window.location.pathname)) {
        return;
      }
    
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.email) {
            dispatch(login(parsedUser));
            if (window.location.pathname !== '/') {
              navigate("/");
            }
          }
        } catch (e) {
          localStorage.removeItem('user');
        }
      } else {
        if (!['/login', '/signup'].includes(window.location.pathname)) {
          navigate("/login");
        }
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  // Authentication handlers
  const handleLogin = async (formData) => {
    try {
      setAuthError("");
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        dispatch(login(response.user));
        toast.success(`Welcome back, ${response.user.name}!`);
        navigate("/");
      } else {
        setAuthError(response.message);
      }
    } catch (error) {
      setAuthError("An unexpected error occurred");
    }
  };

  const handleSignup = async (formData) => {
    try {
      setAuthError("");
      toast.loading("Creating your account..."); 
      
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password
      );
  
      if (response.success) {
        toast.dismiss(); 
        toast.success(`Welcome ${response.user.name}! Account created successfully.`);
        dispatch(login(response.user));
        navigate("/");
      } else {
        toast.dismiss(); 
        toast.error(response.message || "Signup failed. Please try again.");
        setAuthError(response.message);
      }
    } catch (error) {
      toast.dismiss(); 
      toast.error("An unexpected error occurred during signup");
      console.error("Signup error:", error);
    }
  };
  
  // Task operation handlers
  const handleDeleteClick = useCallback((id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return toast.error("Task not found!");
    setTaskToDelete(taskIndex);
    setShowDeleteConfirm(true);
  }, [tasks]);
  
  const confirmDelete = () => {
    dispatch(deleteTask(taskToDelete));
    setShowDeleteConfirm(false);
    toast.success("Task deleted!")
  };

  const deleteSelectedTasks = () => {
    const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.id));
    dispatch(updateTasks(updatedTasks));
    setSelectedTasks([]);
    toast.success(`Deleted ${selectedTasks.length} task(s)`);
  };

  const handleEditClick = useCallback((id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return toast.error("Task not found!");

    setTaskToEdit(taskIndex);
    setOriginalText(tasks[taskIndex].task);
    setEditedText(tasks[taskIndex].task);
    setShowEditConfirm(true);
  }, [tasks]);

  const confirmEdit = () => {
    const updatedTasks = [...tasks];
    updatedTasks[taskToEdit] = {
      ...updatedTasks[taskToEdit],
      ...editedTask
    };
    dispatch(updateTasks(updatedTasks));
    setShowEditConfirm(false);
    toast.success("Task updated!");
  };

  const handleSelectAll = (status) => {
    const columnTasks = tasks.filter(task => task.status === status);
    const allSelected = columnTasks.every(task => selectedTasks.includes(task.id));

    setSelectedTasks(prev =>
      allSelected
        ? prev.filter(id => !columnTasks.some(task => task.id === id))
        : [...new Set([...prev, ...columnTasks.map(task => task.id)])]
    );

    const statusName = {
      todo: "To Do",
      doing: "In Progress",
      done: "Completed"
    };

    toast.success(
      allSelected 
        ? `Unselected all from "${statusName[status]}"`
        : `Selected all from "${statusName[status]}"`
    );
  };

  // Drag-and-drop handler
  const onDrop = (newStatus, position) => {
    if (!activeCard) return;

    const taskIndex = tasks.findIndex(task => task.id === activeCard);
    if (taskIndex === -1) return;
  
    const updatedTasks = [...tasks];
    
    const [movedTask] = updatedTasks.splice(taskIndex, 1);
    
    updatedTasks.splice(position, 0, {
      ...movedTask,
      status: newStatus 
    });

    dispatch(updateTasks(updatedTasks));
    setActiveCard(null);

    if (newStatus === 'done') {
      fireConfetti();
    }

    const statusName = {
      todo: "To Do",
      doing: "In Progress",
      done: "Completed"
    };

    toast.success(`Task moved to "${statusName[newStatus]}"`);
  };

  const handleAddNewTask = async (newTaskData) => {
    const updatedTasks = [...tasks, {
      id: Date.now(),
      ...newTaskData,
      status: 'todo'
    }];
    dispatch(updateTasks(updatedTasks));
    toast.success("New task added!");
  };

  const modalConfig = {
    delete: {
      show: showDeleteConfirm,
      onClose: () => setShowDeleteConfirm(false),
      onConfirm: confirmDelete,
    },
    edit: {
      show: showEditConfirm,
      onClose: () => setShowEditConfirm(false),
      onConfirm: confirmEdit,
      taskIndex: taskToEdit,
      editedTask,
      setEditedTask,
    },
    new: {
      show: showNewTaskModal,
      onClose: () => setShowNewTaskModal(false),
      onSubmitNewTask: handleAddNewTask,
    },
    bulkDelete: {
      show: showBulkDeleteConfirm,
      onClose: () => setShowBulkDeleteConfirm(false),
      onConfirm: () => {
        deleteSelectedTasks();
        setShowBulkDeleteConfirm(false);
      },
    },
  };


  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? (
            <AuthForm 
              type="login" 
              onSubmit={handleLogin} 
              error={authError}
              clearError={() => setAuthError("")}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        <Route path="/signup" element={
          !isAuthenticated ? (
            <AuthForm 
              type="signup" 
              onSubmit={handleSignup} 
              error={authError}
              clearError={() => setAuthError("")}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }/>

        <Route path="/" element={
          isAuthenticated ? (
            <>
              <div className="top-header">
                <UserDropdown />
              </div>

              <TaskForm onNewTask={() => setShowNewTaskModal(true)} />

              <main className="app_main">
                <div className="columns_container">
                  {['todo', 'doing', 'done'].map((status) => (
                    <TaskColumn
                      key={status}
                      title={`${status === 'todo' ? 'To Do' : status === 'doing' ? 'In Progress' : 'Completed'} Tasks`}
                      tasks={tasks}
                      status={status}
                      setActiveCard={setActiveCard}
                      onDrop={onDrop}
                      onDelete={handleDeleteClick}
                      onEdit={handleEditClick}
                      selectedTasks={selectedTasks}
                      onSelectAll={handleSelectAll}
                      onToggleSelect={toggleTaskSelection}
                    />
                  ))}
                </div>
              </main>

              {/* Modals */}
              {Object.entries(modalConfig).map(([type, props]) =>
                props.show ? <Modals key={type} type={type} {...props} /> : null
              )}

              {selectedTasks.length > 0 && (
                <>
                  <Modals
                    type="delete"
                    show={showBulkDeleteConfirm}
                    onClose={() => setShowBulkDeleteConfirm(false)}
                    onConfirm={() => {
                      deleteSelectedTasks();
                      setShowBulkDeleteConfirm(false);
                    }}
                  />
                  <div className="floating-delete-container">
                    <button
                      className="floating-delete-btn"
                      onClick={() => setShowBulkDeleteConfirm(true)}
                    >
                      Delete Selected ({selectedTasks.length})
                    </button>
                  </div>
                </>
              )}


            </>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </div>
  );
};

export default App;

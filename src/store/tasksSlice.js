import { createSlice } from '@reduxjs/toolkit';

const saveTasks = (tasks) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.email) {
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    allTasks[user.email] = tasks;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
  }
};

const loadInitialTasks = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
  return user?.email ? allTasks[user.email] || [] : [];
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadInitialTasks(),
  reducers: {
    addTask: {
      reducer: (state, action) => {
        const newState = [...state, action.payload];
        saveTasks(newState);
        return newState;
      },
      prepare: (taskData) => {
        return {
          payload: {
            ...taskData,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            createdAt: new Date().toISOString()
          }
        };
      }
    },
    updateTasks: (state, action) => {
      const newState = [...action.payload];
      saveTasks(newState);
      return newState;
    },
    deleteTask: (state, action) => {
      const newState = state.filter(task => task.id !== action.payload);
      saveTasks(newState);
      return newState;
    },
    moveTask: {
      reducer: (state, action) => {
        const { taskId, newStatus, newPosition } = action.payload;
        const taskIndex = state.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return state;

        const updatedTasks = [...state];
        const [movedTask] = updatedTasks.splice(taskIndex, 1);
        updatedTasks.splice(newPosition, 0, { ...movedTask, status: newStatus });

        saveTasks(updatedTasks);
        return updatedTasks;
      },
      prepare: (taskId, newStatus, newPosition) => {
        return { payload: { taskId, newStatus, newPosition } };
      }
    },
    clearTasks: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email) {
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        delete allTasks[user.email];
        localStorage.setItem('tasks', JSON.stringify(allTasks));
      }
      return [];
    }
  }
});

export const { addTask, updateTasks, deleteTask, moveTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  initialized: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialized = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      const userEmail = state.user?.email;
      
      if (userEmail) {
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        delete allTasks[userEmail];
        localStorage.setItem('tasks', JSON.stringify(allTasks));
      }
      
      localStorage.removeItem('user');
      localStorage.removeItem('reduxState');
      
      state.user = null;
      state.isAuthenticated = false;
      state.initialized = true;
    }
  }
});

export const selectCurrentUser = (state) => state.auth.user;
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
import { configureStore } from '@reduxjs/toolkit';
import { loadState, saveState } from '../utils/persist';
import authReducer from './authSlice';
import tasksReducer from './tasksSlice';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer
  },
  preloadedState
});

store.subscribe(() => {
  saveState(store.getState());
});
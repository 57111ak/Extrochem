import { configureStore } from '@reduxjs/toolkit';
import moleculesReducer from './moleculeSlice';

export const store = configureStore({
  reducer: {
    molecules: moleculesReducer,
  },
});
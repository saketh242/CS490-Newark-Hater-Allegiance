// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,      
    dbUser: null,    
    isLoading: true, 
    history: []
  },
  reducers: {
    // Setter functions for all auth fields
    // Setter for firebases user object
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Setter for dbUser object, dbUser is the user object from the database
    setDbUser: (state, action) => {
      state.dbUser = action.payload;
    },
    // Setter for loading state
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    deleteHistory: (state, action) => {
      const { historyId } = action.payload;
      state.history = state.history.filter(item => item._id !== historyId);
    },
    clearHistory: (state) => {
      state.history = [];
      state.error = null;
    },
  },
});

export const { setUser, setDbUser, setIsLoading, setHistory, deleteHistory, clearHistory } = userSlice.actions;

export default userSlice.reducer;

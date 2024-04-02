// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,      
    dbUser: null,    
    isLoading: true, 
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
  },
});

export const { setUser, setDbUser, setIsLoading } = userSlice.actions;

export default userSlice.reducer;

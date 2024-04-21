import { createSlice } from '@reduxjs/toolkit';

export const historiesSlice = createSlice({
  name: 'histories',
  initialState: {
    history: [],
    error: null,
  },
  reducers: {
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

export const { setHistory, deleteHistory, clearHistory } = historiesSlice.actions;
export const selectHistory = state => state.histories.history;

export default historiesSlice.reducer;
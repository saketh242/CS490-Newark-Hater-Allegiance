import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
  },
  reducers: {
    updateUserName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { updateUserName } = userSlice.actions;

export default userSlice.reducer;
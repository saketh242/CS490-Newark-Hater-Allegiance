import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sourceLanguage: '',
  destinationLanguage: '',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    // Action to set the source language
    setSourceLanguage: (state, action) => {
      state.sourceLanguage = action.payload;
    },
    // Action to set the destination language
    setDestinationLanguage: (state, action) => {
      state.destinationLanguage = action.payload;
    },
  },
});

// Actions generated from the slice
export const { setSourceLanguage, setDestinationLanguage } = languageSlice.actions;

// Selector to get the source language from the state
export const selectSourceLanguage = (state) => state.language.sourceLanguage;

// Selector to get the destination language from the state
export const selectDestinationLanguage = (state) => state.language.destinationLanguage;

// The reducer
export default languageSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

export const ratingsSlice = createSlice({
  name: 'ratings',
  initialState: {
    totalFeedbackAverage: null,
    averageTranslationRating: null,
    averageUXRating: null,
    count:null,
    fetchingRatings: true,
  },
  reducers: {
    setRatings: (state, action) => {
      const { totalFeedbackAverage, averageTranslationRating, averageUXRating, count } = action.payload;
      state.totalFeedbackAverage = totalFeedbackAverage;
      state.averageTranslationRating = averageTranslationRating;
      state.averageUXRating = averageUXRating;
      state.count = count;
      state.fetchingRatings = false; 

    },
    startFetchingRatings: (state) => {
        state.fetchingRatings = true; 
      },
      stopFetchingRatings: (state) => {
        state.fetchingRatings = false;
      }
  },
});

export const { setRatings, startFetchingRatings, stopFetchingRatings } = ratingsSlice.actions;

// Selectors
export const selectTotalFeedbackAverage = state => state.ratings.totalFeedbackAverage;
export const selectAverageTranslationRating = state => state.ratings.averageTranslationRating;
export const selectAverageUXRating = state => state.ratings.averageUXRating;
export const selectCount = state => state.ratings.count;
export const selectFetchingRatings = state => state.ratings.fetchingRatings;

export default ratingsSlice.reducer;

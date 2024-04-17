import { createSlice } from '@reduxjs/toolkit'

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    fetchingReviews: true,
  },
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload
      state.fetchingReviews = false
    },
    startFetchingReviews: (state) => {
      state.fetchingReviews = true
    },
    stopFetchingReviews: (state) => {
      state.fetchingReviews = false
    }
  },
})

export const { setReviews, startFetchingReviews, stopFetchingReviews } = reviewsSlice.actions
export default reviewsSlice.reducer

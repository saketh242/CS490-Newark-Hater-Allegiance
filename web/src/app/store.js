import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import reviewsReducer from "../features/reviews/reviewSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewsReducer,
  },
});
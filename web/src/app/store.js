import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import reviewsReducer from "../features/reviews/reviewSlice";
import ratingsReducer from "../features/ratings/ratingsSlice";
import historiesReducer from "../features/histories/historiesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewsReducer,
    ratings: ratingsReducer,
    histories: historiesReducer, 
  },
});

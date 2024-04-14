import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeReviews from '../components/HomeReviews';

import { store } from '../app/store';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import reviewsReducer from '../features/reviews/reviewSlice';
import ratingsReducer from '../features/ratings/ratingsSlice';
import userReducer from '../features/user/userSlice'; 

// Mock data for the reviews slice
const mockReviewsState = {
  reviews: [
    {
      id: 1,
      textMessage: 'Great service!',
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    },
  ],
  fetchingReviews: false,
};

// Mock data for the user slice
const mockUserState = {
  user: {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
  dbUser: {
    id: 1,
    username: 'johndoe',
  },
  isLoading: false,
};

// Mock the Redux store
const mockStore = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewsReducer,
    ratings: ratingsReducer,
  },
  preloadedState: {
    user: mockUserState,
    reviews: mockReviewsState,
    ratings: {
      totalFeedbackAverage: 4.5,
      averageTranslationRating: 4,
      averageUXRating: 4.2,
      count: 100,
      fetchingRatings: false,
    },
  },
});

describe('Aggregated Feedback Results', () => {
  test('renders the Aggregated Feedback Results', () => {
    render(
      <Provider store={mockStore}>
        <HomeReviews />
      </Provider>
    );

    expect(screen.getByTestId('totalRating')).toBeInTheDocument()
    expect(screen.getByTestId('translationQuality')).toBeInTheDocument()
    expect(screen.getByTestId('userExperience')).toBeInTheDocument()
  });
});

describe('Carousel Reviews', () => {
  test('renders the Feedback Carousel', () => {
    render(
      <Provider store={store}>
        <HomeReviews />
      </Provider>
    );

    expect(screen.getByText(/Some of our reviews/i)).toBeInTheDocument()
  });

  test('reviews load on home page', () => {
    render(
      <Provider store={store}>
        <HomeReviews />
      </Provider>
    );
    expect(screen.getByText(/Some of our reviews/i)).toBeInTheDocument();
  });
})
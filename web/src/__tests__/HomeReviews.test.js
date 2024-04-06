import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// import { BrowserRouter as Router } from 'react-router-dom';
import HomeReviews from '../components/HomeReviews';

import { store } from '../app/store';
import { Provider } from 'react-redux';

describe('HomeReview Component Tests', () => {
  test('renders the HomeReviews component', () => {
    render(
      <Provider store={store}>
        <HomeReviews />
      </Provider>
    );

    expect(screen.getByText(/Some of our reviews/i)).toBeInTheDocument()
  });
});

test('reviews load on home page', () => {
  render(
    <Provider store={store}>
      <HomeReviews />
    </Provider>
  );
  expect(screen.getByText(/Some of our reviews/i)).toBeInTheDocument();
});

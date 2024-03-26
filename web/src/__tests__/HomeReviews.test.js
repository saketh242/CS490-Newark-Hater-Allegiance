import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeReviews from '../components/HomeReviews';

describe('HomeReview Component Tests', () => {
    test('renders the HomeReviews component', () => {
      render(
          <HomeReviews />
      );
 
      expect(screen.getByText(/Some of our reviews/i)).toBeInTheDocument()
    });
  });

test('reviews load on home page', () => {
    render(
        <HomeReviews />
    );
    expect(screen.getByText(/Some of our reviews/i)).toBeInTheDocument();
  });

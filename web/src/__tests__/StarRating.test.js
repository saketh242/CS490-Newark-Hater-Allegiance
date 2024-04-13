import React from 'react';
import { render, screen } from '@testing-library/react';
import StarRating from '../components/StarRating';

describe('StarRating component', () => {
  const averageRating = 3.5;
  const size = "2x";
  const className = "customClass";

  test('renders appropriate number of stars based on average rating', async () => {
    await render(
      <StarRating averageRating={averageRating} size={size} className={className} />
    );

    // Find all stars within the StarRating component
    const filledStars = await screen.findAllByTestId('filledStar');
    const halfStar = await screen.getByTestId('halfStar');
    const emptyStars = await screen.findAllByTestId('emptyStar');

    // Check if the correct number of stars are rendered
    expect(filledStars.length).toBe(3); // Full stars should be 3
    expect(halfStar).toBeInTheDocument(); // There should be a half star
    expect(emptyStars.length).toBe(1); // Empty stars should be 1
  });

  test('renders stars with correct size and className', () => {
    render(
      <StarRating averageRating={averageRating} size={size} className={className} />
    );

    const allStars = screen.getAllByTestId(/(filledStar|halfStar|emptyStar)/);
  
    allStars.forEach(star => {
      const icons = star.querySelectorAll('svg'); //find fontawesomeicon components
  
      icons.forEach(icon => {
        const iconSize = icon.getAttribute('data-icon');
        
        // Assert that the iconSize matches the expected size prop value
        expect(iconSize).toBe(size);
      });
      
      expect(star).toHaveClass(className);
    });
  });
  
});

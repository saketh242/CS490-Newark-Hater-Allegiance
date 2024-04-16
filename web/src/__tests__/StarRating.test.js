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
    expect(filledStars.length).toBe(3); 
    expect(halfStar).toBeInTheDocument(); 
    expect(emptyStars.length).toBe(1); 
  });

  test('renders stars with correct size and className', () => {
    render(
      <StarRating averageRating={averageRating} size={size} className={className} />
    );

    const allStars = screen.getAllByTestId(/(filledStar|halfStar|emptyStar)/);
  
    allStars.forEach(star => {
      const icons = star.querySelectorAll('svg');
  
      icons.forEach(icon => {
        const iconSize = icon.getAttribute('data-icon');
        
        expect(iconSize).toBe(size);
      });
      
      expect(star).toHaveClass(className);
    });
  });

  test('renders correct number of full stars', () => {
    const { getAllByTestId } = render(<StarRating averageRating={3.5} />);
    const filledStars = getAllByTestId('filledStar');
    expect(filledStars).toHaveLength(3);
  });

  test('renders half star when averageRating has a decimal part of 0.5 or greater', () => {
    const { getAllByTestId } = render(<StarRating averageRating={2.5} />);
    const halfStars = getAllByTestId('halfStar');
    expect(halfStars).toHaveLength(1);
  });

  test('renders correct number of empty stars', () => {
    const { getAllByTestId } = render(<StarRating averageRating={4} />);
    const emptyStars = getAllByTestId('emptyStar');
    expect(emptyStars).toHaveLength(1);
  });

  test('renders nothing when averageRating is 0', () => {
    const { container } = render(<StarRating averageRating={0} />);
    expect(container.firstChild).toBeNull();
  });


  test('renders all filled stars when averageRating is 5', () => {
    const { getAllByTestId } = render(<StarRating averageRating={5} />);
    const filledStars = getAllByTestId('filledStar');
    expect(filledStars).toHaveLength(5);
  });
  
  
});

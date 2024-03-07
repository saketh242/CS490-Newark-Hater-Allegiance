import { render, screen } from '@testing-library/react';
import Home from '../src/components/Home/Home';
import { MemoryRouter } from 'react-router-dom';

describe('Home', () => {
  it('renders the Home component', () => {
    render(<Home />, { wrapper: MemoryRouter });

    // Define a function to test media queries programmatically
    const testMediaQueries = (query, width) => {
      const mediaQueryList = window.matchMedia(query);
      
      // Set the window width to the desired value for the media query
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      // Trigger the listener for media query changes
      const listener = () => {};
      mediaQueryList.addEventListener('change', listener);
      
      // Re-render the component with the updated window width
      render(<Home />, { wrapper: MemoryRouter });

      // Test if certain styles are applied based on the media query
      // Example: Test if certain styles are applied when matching the query
      if (mediaQueryList.matches) {
        // Add assertions here for styles applied when media query matches
      } else {
        // Add assertions here for styles applied when media query doesn't match
      }
      
      // Clean up by removing the event listener
      mediaQueryList.removeEventListener('change', listener);
    };

    // Test media queries for different screen widths
    testMediaQueries('(max-width: 900px)', 800); // Test for max-width 900px
    testMediaQueries('(min-width: 600px) and (max-width: 900px)', 700); // Test for range 600px to 900px
    // Add more test cases for other media queries as needed
  });
});
// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer render', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    // Assert that the component renders the expected text
    expect(screen.getByText('© 2024 Newark Hater Allegiance. All rights reserved.')).toBeInTheDocument();
  });
});
// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/Footer';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Assert that the component renders the expected text
    expect(screen.getByText('© 2024 Newark Hater Allegiance. All rights reserved.')).toBeInTheDocument();
  });
});
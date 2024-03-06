import { render, screen } from '@testing-library/react'
import HomeReviews from '../src/components/HomeReviews/HomeReviews'
import { MemoryRouter } from 'react-router-dom';

describe('HomeReviews', () => {
  it('renders the HomeReviews component', () => {
    render(<HomeReviews />, {wrapper: MemoryRouter})
    
    // screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

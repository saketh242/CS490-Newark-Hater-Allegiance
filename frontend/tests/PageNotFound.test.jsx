import { render, screen } from '@testing-library/react'
import PageNotFound from '../src/components/PageNotFound/PageNotFound'
import { MemoryRouter } from 'react-router-dom';

describe('PageNotFound', () => {
  it('renders the PageNotFound component', () => {
    render(<PageNotFound />, {wrapper: MemoryRouter})
    
    // screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

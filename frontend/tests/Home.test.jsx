import { render, screen } from '@testing-library/react'
import Home from '../src/components/Home/Home'
import { MemoryRouter } from 'react-router-dom';

describe('Home', () => {
  it('renders the Home component', () => {
    render(<Home />, {wrapper: MemoryRouter})
    
    // screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

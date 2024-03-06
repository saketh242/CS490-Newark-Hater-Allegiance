import { render, screen } from '@testing-library/react'
import Footer from '../src/components/Footer/Footer'
import { MemoryRouter } from 'react-router-dom';

describe('Footer', () => {
  it('renders the Footer component', () => {
    render(<Footer />, {wrapper: MemoryRouter})
    
    // screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

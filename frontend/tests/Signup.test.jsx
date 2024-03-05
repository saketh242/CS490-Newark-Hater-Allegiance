import { render, screen } from '@testing-library/react'
import Signup from '../src/components/Signup/Signup'
import { MemoryRouter } from 'react-router-dom';

describe('Signup', () => {
  it('renders the Signup component', () => {
    render(<Signup />, {wrapper: MemoryRouter})
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

import { render, screen } from '@testing-library/react'
import StarGroup from '../src/components/StarGroup/StarGroup'
import { MemoryRouter } from 'react-router-dom';

describe('StarGroup', () => {
  it('renders the StarGroup component', () => {
    render(<StarGroup />, {wrapper: MemoryRouter})
    
    // screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

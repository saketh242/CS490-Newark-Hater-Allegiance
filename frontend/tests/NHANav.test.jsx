import { render, screen } from '@testing-library/react'
import NHANav from '../src/components/NHANav/NHANav'
import { MemoryRouter } from 'react-router-dom';

describe('NHANav', () => {
  it('renders the NHANav component', () => {
    render(<NHANav />, {wrapper: MemoryRouter})
    
    // screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

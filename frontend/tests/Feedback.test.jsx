import { render, screen } from '@testing-library/react'
import Feedback from '../src/components/Feedback/Feedback'
import { MemoryRouter } from 'react-router-dom';

describe('Feedback', () => {
  it('renders the Feedback component', () => {
    render(<Feedback />, {wrapper: MemoryRouter})
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

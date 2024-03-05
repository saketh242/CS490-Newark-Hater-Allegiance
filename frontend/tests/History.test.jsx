import { render, screen } from '@testing-library/react'
import History from '../src/components/History/History'
import { MemoryRouter } from 'react-router-dom';

describe('History', () => {
  it('renders the History component', () => {
    render(<History />, {wrapper: MemoryRouter})
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

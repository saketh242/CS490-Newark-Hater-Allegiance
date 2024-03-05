import { render, screen } from '@testing-library/react'
import Docs from '../src/components/Docs/Docs'
import { MemoryRouter } from 'react-router-dom';

describe('Docs', () => {
  it('renders the Docs component', () => {
    render(<Docs />, {wrapper: MemoryRouter})
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})
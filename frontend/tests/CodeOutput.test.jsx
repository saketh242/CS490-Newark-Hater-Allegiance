import { render, screen } from '@testing-library/react'
import CodeOutput from '../src/components/CodeOutput/CodeOutput'
import { MemoryRouter } from 'react-router-dom';

describe('CodeOutput', () => {
  it('renders the codeoutput component', () => {
    render(<CodeOutput />, {wrapper: MemoryRouter})
    
    // screen.debug(); // prints out the jsx in the App component unto the command line
  })
})
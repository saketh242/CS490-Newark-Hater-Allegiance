import { render, screen } from '@testing-library/react'
import Translate from '../src/components/Translate/Translate'
import { MemoryRouter } from 'react-router-dom';

describe('Translate', () => {
  it('renders the Translate component', () => {
    render(<Translate />, {wrapper: MemoryRouter})
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../src/components/Login/Login'; // Update the import path accordingly
import { MemoryRouter } from 'react-router-dom';

describe('Login', () => {
  it('renders the login component', async () => {
    render(<Login />, {wrapper: MemoryRouter})
    
    screen.debug(); // prints out the JSX in the Login component to the command line
  })
})

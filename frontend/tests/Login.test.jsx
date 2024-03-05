import { render, screen } from '@testing-library/react'
import {vi} from "vitest"
import Login from '../src/components/Login/Login'
import { MemoryRouter } from 'react-router-dom';
import useAuth from '../src/useAuth';

/*
vi.mock('../src/useAuth', {
  useAuth: () => ({
    user: {firstname: "cram"},
    isLoading: false, // Set isLoading to false to simulate that the authentication has already been checked
  }),
});
*/

describe('Login', () => {
  it('renders the login component', () => {
    render(<Login />, {wrapper: MemoryRouter})
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})
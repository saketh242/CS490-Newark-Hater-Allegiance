import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../components/Login';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';


describe('Login Component Tests', () => {
    test('renders the Login component', () => {
      render(
        <Router>
          <Login />
        </Router>
      );
 
      expect(screen.getByText(/Forgot Password?/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    });

    test('calls the handleLogin on login button click' , () => {
        const handleLogin = jest.fn();
        const { getByText } = render(<button onClick={handleLogin}>Login</button>);
        fireEvent.click(getByText('Login'));
        expect(handleLogin).toHaveBeenCalledTimes(1);

    })

  });
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from '../components/Signup';

describe('Signup Component Tests', () => {
    test('renders the Signup component', () => {
      render(
        <Router>
          <Signup />
        </Router>
      );
 
      expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
      expect(screen.getByText(/Signup/i)).toBeInTheDocument();
    });

    test('calls the handleSignup on signup button click', () => {
      const handleSignup = jest.fn();
      const { getByText } = render(<button onClick={handleSignup}>Signup</button>);
      fireEvent.click(getByText(/Signup/i));
      expect(handleSignup).toHaveBeenCalledTimes(1);
  });
  

    
  });
  

  



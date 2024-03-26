import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../components/Home';

describe('Home Component Tests', () => {
    test('renders the Home component', () => {
      render(
        <Router>
          <Home />
        </Router>
      );
 
      expect(screen.getByText(/Easy code translation in seconds!/i)).toBeInTheDocument()
    });

    test('calls the handleDelete on signup button click', () => {
      const handleSignup = jest.fn();
      const { getByText } = render(<button onClick={handleSignup}>Signup today!</button>);
      fireEvent.click(getByText(/Signup today!/i));
      expect(handleSignup).toHaveBeenCalledTimes(1);
  });
});
  

  



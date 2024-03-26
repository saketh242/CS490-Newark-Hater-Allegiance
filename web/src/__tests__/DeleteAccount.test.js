import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import DeleteAccount from '../components/DeleteAccount';

describe('DeleteAccount Component Tests', () => {
    test('renders the Signup component', () => {
      render(
        <Router>
          <DeleteAccount />
        </Router>
      );
 
      expect(screen.getByText(/Deleted accounts cannot be recovered again!/i)).toBeInTheDocument()
    });

    test('calls the handleDelete on signup button click', () => {
      const handleDelete = jest.fn();
      const { getByText } = render(<button onClick={handleDelete}>Delete Account</button>);
      fireEvent.click(getByText(/Delete Account/i));
      expect(handleDelete).toHaveBeenCalledTimes(1);
  });
  });
  

  



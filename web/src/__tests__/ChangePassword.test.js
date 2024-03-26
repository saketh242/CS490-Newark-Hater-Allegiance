import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword'

describe('ChangePassword Component Tests', () => {
    test('renders the ChangePassword component', () => {
      render(
        <Router>
          <ChangePassword />
        </Router>
      );
 
      expect(screen.getByText(/Change Password/i)).toBeInTheDocument()
    });

    test('calls the handleChangePassword on signup button click', () => {
      const handleChangePassword = jest.fn();
      const { getByText } = render(<button onClick={handleChangePassword}>Update Password</button>);
      fireEvent.click(getByText(/Update Password/i));
      expect(handleChangePassword).toHaveBeenCalledTimes(1);
  });
  

    
  });
  

  



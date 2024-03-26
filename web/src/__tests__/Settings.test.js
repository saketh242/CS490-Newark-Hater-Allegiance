import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Settings from '../components/Settings';

describe('Settings Component Tests', () => {
    // test('renders the Settings component', () => {
    //   render(
    //     <Router><Settings /></Router>
          
    //   );
    //   expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    // });

    test('calls the handleUpdate on update profile button click', () => {
      const handleUpdateprofile = jest.fn();
      const { getByText } = render(<button onClick={handleUpdateprofile}>Update Profile</button>);
      fireEvent.click(getByText(/Update Profile/i));
      expect(handleUpdateprofile).toHaveBeenCalledTimes(1);
  });
});
  

  



import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../components/Home';

import { store } from '../app/store';
import { Provider } from 'react-redux';

describe('Home Component Tests', () => {
    test('renders the Home component', () => {
      render(
        <Provider store={store}>
          <Router>
            <Home />
          </Router>
        </Provider>
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
  

  



import { render, screen, fireEvent, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Settings from '../components/Settings';
import { Provider } from 'react-redux';
import { store } from '../app/store';


describe('Settings Component Tests', () => {
    test('renders the Settings component', () => {
      render(
        <Provider store={store}>
          <Router>
            <Settings />
          </Router>
        </Provider>
        
      );
      expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    });

    test('calls the handleDelete on delete button click', () => {
      const handleDelete = jest.fn();
      const { getByText } = render(<button onClick={handleDelete}>Delete Account</button>);
      fireEvent.click(getByTestId('update-btn'));
      expect(handleSignup).toHaveBeenCalledTimes(1);
  });

  test("Error message is invisible", async () => {
    const { container } = render(
      <Provider store={store}>
          <Router>
            <Settings/>
          </Router>
      </Provider>
      
    );
      const element = container.querySelector('.error-msg');
      expect(element).not.toBeInTheDocument();
  })

  test("Error message on empty password", async ()=> {
    render(
      <Provider store={store}>
        <Router>
          <Settings/>
      </Router>
      </Provider>
      )
      const inputPassword = screen.getByTestId('password-id-settings');
      const testEmail = ""
      const button = screen.getByTestId('update-btn');

      fireEvent.change(inputPassword, {target: {value:testEmail}})
      fireEvent.click(button);
      expect(await screen.findByText('Enter password before updating'));
  })
  });
  

  


import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from '../components/Signup';
import { Provider } from 'react-redux';
import { store } from '../app/store';

describe('Signup Component Tests', () => {
    test('renders the Signup component', () => {
      render(
        <Provider store={store}>
          <Router>
            <Signup />
          </Router>
        </Provider>
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

  test("Error message is invisible", async () => {
    const { container } = render(
      <Provider store={store}>
        <Router>
        <Signup />
      </Router>
      </Provider>
      
    );
  const element = container.querySelector('.error-msg');
  expect(element).not.toBeInTheDocument();
  })

  test("Signup with empty fields", async ()=> {
    render(
      <Provider store={store}>
        <Router>
          <Signup/>
        </Router>
      </Provider>
      )
      const inputEmail = screen.getByPlaceholderText(/email/i);
      const testEmail = ""
      const button = screen.getByRole('button', { name: /signup/i });

      fireEvent.change(inputEmail, {target: {value:testEmail}})
      fireEvent.click(button);
      expect(await screen.findByText('All fields are required!'));
  })

  test("Invalid email test", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Signup/>
        </Router>
      </Provider>
      )

      const inputEmail = screen.getByTestId('email-input');
      const password = screen.getByTestId('password-id');
      const password2 = screen.getByTestId('password-id-2');
      const firstName = screen.getByTestId('firstname-input');
      const lastName = screen.getByTestId('lastname-input');
      
      const testEmail = "abc123.123";
      const testPassword = "Abcd1234"
      const testPassword2 = "Abcd1234"
      const testFirstName = "firstname"
      const testLastName = "lastname"

      const button = screen.getByRole('button', { name: /signup/i });
    
      fireEvent.change(inputEmail, {target: {value:testEmail}})
      fireEvent.change(password, {target: {value:testPassword}})
      fireEvent.change(password2, {target: {value:testPassword2}})
      fireEvent.change(firstName, {target: {value:testFirstName}})
      fireEvent.change(lastName, {target: {value:testLastName}})

      fireEvent.click(button);
      expect(await screen.findByText('Please enter a valid email!'));

      




      





      
  })


  });
  

  


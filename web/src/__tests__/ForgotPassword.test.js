import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ForgotPassword from '../components/ForgotPassword';

import { store } from '../app/store';
import { Provider } from 'react-redux';

describe('ForgotPassword Component Tests', () => {
    test('renders the Forgot password component', () => {
      render(
        <Provider store={store}>
          <Router>
            <ForgotPassword />
          </Router>
        </Provider>
      );
      expect(screen.getByText("Forgot password?")).toBeInTheDocument()
    });

    test("Error message is invisible", async () => {
      const { container } = render(
        <Provider store={store}>
          <Router>
            <ForgotPassword />
          </Router>
        </Provider>
      );
        const element = container.querySelector('.error-msg');
        expect(element).not.toBeInTheDocument();
    })

    test("error message on empty email", async () => {
      render(
        <Provider store={store}>
          <Router>
            <ForgotPassword />
          </Router>
        </Provider>
      );
        const email = screen.getByTestId('email-id');
        const testEmail = ""
        fireEvent.change(email, {target: {value:testEmail}})
        const button = screen.getByRole('button', { name: /Send password reset email/i });
        fireEvent.click(button)
        expect(await screen.findByText('Enter email! ヽ（≧□≦）ノ'));
    })
})
        
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ForgotPassword from '../components/ForgotPassword';

describe('ForgotPassword Component Tests', () => {
    test('renders the Forgot password component', () => {
      render(
          <Router>
            <ForgotPassword />
          </Router>
      );
      expect(screen.getByText("Forgot password?")).toBeInTheDocument()
    });

    test("Error message is invisible", async () => {
      const { container } = render(
            <Router>
              <ForgotPassword/>
            </Router>
      );
        const element = container.querySelector('.error-msg');
        expect(element).not.toBeInTheDocument();
    })

    test("error message on empty email", async () => {
        const email = screen.getByTestId('email-id');
        const testEmail = ""
        fireEvent.change(email, {target: {value:testEmail}})
        const button = screen.getByRole('button', { name: /Send password reset email/i });
        fireEvent.click(button)
        expect(await screen.findByText('Enter email! ヽ（≧□≦）ノ'));
    })
})
        
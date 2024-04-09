import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import DeleteAccount from '../components/DeleteAccount';

describe('DeleteAccount Component Tests', () => {
    test('renders the Help component', () => {
      render(
          <Router>
            <DeleteAccount />
          </Router>
      );
      expect(screen.getByText("Deleted accounts cannot be recovered again!")).toBeInTheDocument()
    });

    test("error message on empty password", async () => {
        render(
            <Router>
              <DeleteAccount />
            </Router>
        );
        const password = screen.getByTestId('password-id');
        const testPassword = ""
        fireEvent.change(password, {target: {value:testPassword}})
        const button = screen.getByRole('button', { name: /Delete Account/i });
        fireEvent.click(button)
        expect(await screen.findByText('Please enter your password'));
    })


    // test("Calls handle delete on click", async () => {
    //     render(
    //         <Router>
    //           <DeleteAccount />
    //         </Router>
    //     );
    //     const mockDeleteUser = jest.fn();
    //     const password = screen.getByTestId('password-id');

    //     const testPassword = "testPassword123"
    //     fireEvent.change(password, {target: {value:testPassword}})
    //     const button = screen.getByRole('button', { name: /Delete Account/i });
    //     fireEvent.click(button)
    //     await waitFor(() => {
    //         expect(mockDeleteUser).toHaveBeenCalled();
    //     })

    // })





})
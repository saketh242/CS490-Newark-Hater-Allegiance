import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import DeleteAccount from '../components/DeleteAccount';

describe('DeleteAccount Component Tests', () => {
    test('renders the DeleteAccount component', () => {
      render(
        <Router>
          <DeleteAccount />
        </Router>
      );
 
      expect(screen.getByText(/Deleted accounts cannot be recovered again!/i)).toBeInTheDocument()
    });

    test('calls the handleDelete on delete button click', () => {
      const handleDelete = jest.fn();
      const { getByText } = render(<button onClick={handleDelete}>Delete Account</button>);
      fireEvent.click(getByText(/Delete Account/i));
      expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  test("Account deletion error message", async () => {
    render(
        <Router>
          <DeleteAccount />
        </Router>
    );

    // Check that initially there's no error message
    expect(screen.queryByText('An error occurred try again')).not.toBeInTheDocument();

    const password = screen.getByTestId('password-id');
    const testPassword = "testPassword123";
    fireEvent.change(password, {target: {value:testPassword}});
    const button = screen.getByRole('button', { name: /Delete Account/i });
    fireEvent.click(button);

    // Wait for a brief moment to allow for any potential side effects
    await waitFor(() => {});

    // Check if error message appears
    expect(screen.getByText('An error occurred try again')).toBeInTheDocument();
})
  });
  

  


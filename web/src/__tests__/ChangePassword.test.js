import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import ChangePassword from '../components/ChangePassword'

describe('ChangePassword Component', () => {
  test('renders the ChangePassword component', () => {
    render(<Router><ChangePassword /></Router>)
    expect(screen.getByText(/Change Password/i)).toBeInTheDocument()
  })

  test('calls the handleChangePassword on update password button click', () => {
    const handleChangePassword = jest.fn()
    const { getByText } = render(<button onClick={handleChangePassword}>Update Password</button>)
    fireEvent.click(getByText(/Update Password/i))
    expect(handleChangePassword).toHaveBeenCalledTimes(1)
  })

  test('displays error message when input fields are empty', async () => {
    render(<Router><ChangePassword /></Router>)
    const updatePasswordButton = screen.getByRole('button', { name: /Update Password/i });
    fireEvent.click(updatePasswordButton);
    await waitFor(() => {expect(screen.getByText('Fields cannot be empty')).toBeVisible()})
  })
})
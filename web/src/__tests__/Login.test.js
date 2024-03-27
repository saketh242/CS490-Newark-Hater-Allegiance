import { render, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import Login from '../components/Login'
import { auth } from '../firebase'
import { toast } from 'react-toastify'

jest.mock('../firebase')
jest.mock('react-toastify')

describe('Login', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Login />)
    getByText('NHAGPT')
  })

  it('displays error message when email and password fields are empty', async () => {
    const { getByText, getByPlaceholderText } = render(<Login />)
    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    const loginButton = getByText('Login')

    fireEvent.click(loginButton)

    await waitFor(() => {
      getByText('Please fill all the fields')
    })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      getByText('Login failed. Please check your email and password.')
    })
  })

  it('navigates to home page when login is successful', async () => {
    const history = createMemoryHistory()
    const { getByText, getByPlaceholderText } = render(
      <Router history={history}>
        <Login />
      </Router>
    )
    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    const loginButton = getByText('Login')

    auth.signInWithEmailAndPassword = jest.fn(() => Promise.resolve())
    toast.success = jest.fn()

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(history.location.pathname).toBe('/')
    })
  })
})
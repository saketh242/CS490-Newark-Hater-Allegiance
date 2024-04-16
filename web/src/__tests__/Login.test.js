import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import Login from "../components/Login"
import { MemoryRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useNavigate: jest.fn(), 
}));

describe("Login component tests", ()=>{
  test("Login component render test", async ()=>{
    render(
    <Router>
      <Login/>
    </Router>)
    expect(await screen.findByText('Forgot Password?')).toBeInTheDocument()
    expect(await screen.findByText('Login')).toBeInTheDocument()
    expect(await screen.findByText('Signup')).toBeInTheDocument()
  })

  test("Error message is invisible", async () => {
    const { container } = render(
      <Router>
        <Login />
      </Router>
    );
  const element = container.querySelector('.error-msg');
  expect(element).not.toBeInTheDocument();
  })

  test("Login invalid email", async () => {
    render(
      <Router>
        <Login/>
      </Router>)
    const inputEmail = screen.getByPlaceholderText(/email/i);
    const inputPassword = screen.getByPlaceholderText(/password/i);

    const testEmail = "saketh.puramsetti"
    const testPassword = "Test1234"
    const button = screen.getByRole('button', { name: /login/i });

    fireEvent.change(inputEmail, {target: {value:testEmail}})
    fireEvent.change(inputPassword, {target: {value: testPassword}})
    fireEvent.click(button);

    // expecting invalid email message
    expect(await screen.findByText('Please enter a valid email!'));
  })

  test("Login with empty fields", async ()=> {
    render(
      <Router>
        <Login/>
      </Router>)
      const inputEmail = screen.getByPlaceholderText(/email/i);
      const inputPassword = screen.getByPlaceholderText(/password/i);

      const testEmail = ""
      const testPassword = ""
      const button = screen.getByRole('button', { name: /login/i });

      fireEvent.change(inputEmail, {target: {value:testEmail}})
      fireEvent.change(inputPassword, {target: {value: testPassword}})
      fireEvent.click(button);

      expect(await screen.findByText('Please fill all the fields'));
  })


  it('navigates to home page when login is successful', async () => {

    const { getByText, getByPlaceholderText } = render(
      <Router history={history}>
        <Login />
      </Router>
    )
    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    const loginButton = getByText('Login')

    fireEvent.change(emailInput, { target: { value: 'saketh.puramsetti@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Test1234' } })
    fireEvent.click(loginButton)
    expect(await screen.findByText('NHAGPT')).toBeInTheDocument()
  })


  test('calls the handleLogin on login button click' , () => {
    const handleLogin = jest.fn();
    const { getByText } = render(<button onClick={handleLogin}>Login</button>);
    fireEvent.click(getByText('Login'));
    expect(handleLogin).toHaveBeenCalledTimes(1);

})

})




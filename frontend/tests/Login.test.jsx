import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/components/Login/Login';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vi } from 'vitest';


describe('Login', () => {
  it('renders the Login component', () => {
    render(<Login />, { wrapper: MemoryRouter });

    // we confirm that the Login component is rendered correctly
    expect(screen.getByText('NHAGPT')).toBeInTheDocument();
  });

  it('wrong password credentials', async () => {
    render(<Login />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'saketh.puramsetti@gmail.com' } });

    // simulate the typing code for input into the password box
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'wrongpassword' } });

    // simulating the clicking login button
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Invalid Credentials');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('correct pasword credentials', async () => {
    render(<Login />, { wrapper: MemoryRouter });

    const consoleSpy = vi.spyOn(console, 'log');
    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'saketh.puramsetti@gmail.com' } });

    // simulate the typing code for input into the password box
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    // simulating the clicking login button
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);


    await waitFor(() => {
      // Assert that the toast is displayed
      expect(consoleSpy).toHaveBeenCalledWith('Welcome Saketh Puramsetti');


    });
  });

  it('Invalid email check', async () => {
    render(<Login />, { wrapper: MemoryRouter });

    const consoleSpy = vi.spyOn(console, 'log');
    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'thisemaildoesnot@exist.com' } });

    // simulate the typing code for input into the password box
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    // simulating the clicking login button
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Invalid Credentials');
      expect(errorMessage).toBeInTheDocument();
    });
    
  });

  it('Valid Email check', async () => {
    render(<Login />, { wrapper: MemoryRouter });

    const consoleSpy = vi.spyOn(console, 'log');
    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'invalidemail' } });

    // simulate the typing code for input into the password box
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    // simulating the clicking login button
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Please enter a valid email!');
      expect(errorMessage).toBeInTheDocument();
    });
    
  });

  it('Empty email', async () => {
    render(<Login />, { wrapper: MemoryRouter });

    const consoleSpy = vi.spyOn(console, 'log');
    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: '' } });

    // simulate the typing code for input into the password box
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    // simulating the clicking login button
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Email and password required!');
      expect(errorMessage).toBeInTheDocument();
    });
    
  });

  it('Empty password', async () => {
    render(<Login />, { wrapper: MemoryRouter });

    const consoleSpy = vi.spyOn(console, 'log');
    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'saketh.puramsetti@gmail.com' } });

    // simulate the typing code for input into the password box
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: '' } });

    // simulating the clicking login button
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Email and password required!');
      expect(errorMessage).toBeInTheDocument();
    });
    
  });




})

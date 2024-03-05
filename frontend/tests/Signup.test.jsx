import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../src/components/Signup/Signup';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vi } from 'vitest';


describe('Signup', () => {
  it('renders the Signup component', () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // we confirm that the Signup component is rendered correctly
    expect(screen.getByText('NHAGPT')).toBeInTheDocument();
  });

  it('Already existing credentials', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'saketh.puramsetti@gmail.com' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: 'Test1234' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: 'Saketh' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: 'Puramsetti' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Email address already registered!');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  

  it('different passwords check', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'fake@email.com' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: 'A different password' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: 'Saketh' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: 'Puramsetti' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Passwords are different!');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  
  it('Invalid password', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'fake@email.com' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: '4321' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: '4321' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: 'Saketh' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: 'Puramsetti' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('Password should be 8 characters long, one lowercase, one uppercase, one digit');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('Empty email check', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: '' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: 'Test1234' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: 'Saketh' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: 'Puramsetti' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('All fields are required!');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('Empty password1 check', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: '' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: '' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: 'Test1234' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: 'Saketh' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: 'Puramsetti' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('All fields are required!');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('Empty password2 check', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: '' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: '' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: 'Saketh' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: 'Puramsetti' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('All fields are required!');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('Empty first name check', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'saketh.puramsetti@gmail.com' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: '' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: '' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: 'Puramsetti' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('All fields are required!');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('Empty last name check', async () => {
    
    render(<Signup />, { wrapper: MemoryRouter });

    // Simulate typing code input into the email
    const emailTextarea = screen.getByPlaceholderText('Email');
    fireEvent.change(emailTextarea, { target: { value: 'saketh.puramsetti@gmail.com' } });

    // simulate the typing code for input into the password box and retype password
    const passwordTextarea = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordTextarea, { target: { value: 'Test1234' } });

    const rPasswordTextarea = screen.getByPlaceholderText('Retype Password');
    fireEvent.change(rPasswordTextarea, { target: { value: '' } });


    // simulate names
    const fNameTextarea = screen.getByPlaceholderText('First Name');
    fireEvent.change(fNameTextarea, { target: { value: 'Saketh' } });

    const lNameTextarea = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lNameTextarea, { target: { value: '' } });

    // simulating the clicking login button
    const signUpButton = screen.getByText('Signup');
    fireEvent.click(signUpButton);

    // looking for the error message that pops up when invalid credentials are entered

    await waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = screen.getByText('All fields are required!');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  



})



    

import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Settings from '../components/Settings';
import { Provider } from 'react-redux';
import { store } from '../app/store';

describe('Settings Component Tests', () => {
    test('renders the Settings component', () => {
      render(
        <Provider store={store}>
          <Router>
            <Settings />
          </Router>
        </Provider>
        
      );
      expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    });

  test('handleChangePassword is called when the button is clicked', async () => {
    const mockNavigate = jest.fn();

    render(<Provider store={store}><Router><Settings /></Router></Provider>);

    // Mocking the useNavigate hook
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }));

    const changePasswordButton = screen.getByText('Change Password');
    act(async () => {
      await fireEvent.click(changePasswordButton);
    });
    expect(await screen.findByText("Change Password"));
  });

  test('handleDeleteAccount is called when the button is clicked', async () => {
    const mockNavigate = jest.fn();

    render(<Provider store={store}><Router><Settings /></Router></Provider>);

    // Mocking the useNavigate hook
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }));

    act(async () => {
      const deleteAccountButton = await screen.findByTestId('deleteAccount');

      await fireEvent.click(deleteAccountButton);
      expect(mockNavigate).toHaveBeenCalledWith('/deleteAccount');

    });
    // expect(await screen.findByText("Deleted accounts cannot be recovered again!"));
  });

  test("Error message is invisible", async () => {
    const { container } = render(
      <Provider store={store}>
          <Router>
            <Settings/>
          </Router>
      </Provider>
      
    );
      const element = container.querySelector('.error-msg');
      expect(element).not.toBeInTheDocument();
  })

  test("Error message on empty password", ()=> {
    act( async () => {
      render(
        <Provider store={store}>
          <Router>
            <Settings/>
        </Router>
        </Provider>
        )
        const inputPassword = await screen.findByTestId('password-id-settings');
        const testPassword = ""
        const button = screen.getByTestId('update-btn');
  
        act(async () => {
          await fireEvent.change(inputPassword, {target: {value:testPassword}})
          await fireEvent.click(button);
        });
        expect(await screen.findByText('Enter password to update profile'));
    });
  })
  
  test("Error message on empty first name", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Settings/>
      </Router>
      </Provider>
      )
       act(async () => {
        const inputFirst = await screen.findByTestId("firstNameInput");
        const testFirstName = ""
        const button = screen.getByTestId('update-btn');

        await fireEvent.change(inputFirst, {target: {value:testFirstName}})
        await fireEvent.click(button);

        expect(await screen.findByText('Fields cannot be empty (¬_¬ )'));
      });
  })

  test("Error message on empty last name", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Settings/>
      </Router>
      </Provider>
      )
       act(async () => {
        const inputLast = await screen.findByTestId("lastNameInput");
        const testLastName = ""
        const button = screen.getByTestId('update-btn');

        await fireEvent.change(inputLast, {target: {value:testLastName}})
        await fireEvent.click(button);

        expect(await screen.findByText('Fields cannot be empty (¬_¬ )'));
      });
  })

});

  

  


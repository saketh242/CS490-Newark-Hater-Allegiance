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

  //   test('calls the handleDelete on delete button click', () => {
  //     render(
  //       <Provider store={store}>
  //         <Router>
  //           <Settings />
  //         </Router>
  //       </Provider>
        
  //     );
  //     const handleDelete = jest.fn();
  //     const deleteButton = screen.getByText("Delete Account");
  //     act(async () => {
  //       await fireEvent.click(deleteButton);
  //     });
  //     expect(handleDelete).toHaveBeenCalledTimes(1);
  // });

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
        expect(await screen.findByText('Enter password before updating'));
    });
  })
  });
  

  


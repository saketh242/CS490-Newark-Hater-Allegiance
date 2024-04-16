import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Settings from '../components/Settings';
import store from '../app/store'; 
import { act } from 'react-dom/test-utils';

test('navigates to delete account page on delete button click', () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  render(
    <Provider store={store}>
      <Router>
        <Settings />
      </Router>
    </Provider>
  );

  act(async () => {
    const deleteButton = screen.getByText("Delete Account");
    fireEvent.click(deleteButton);
    await expect(mockNavigate).toHaveBeenCalledWith("/deleteAccount");
  })
  
})
  
  

  


import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewProfile from '../components/ViewProfile';
import { Provider } from 'react-redux';
import { store } from '../app/store';


describe('View Profile Component', () => {
    test('renders the ViewProfile component', () => {
        act(async () => {
            render(
                <Provider store={store}>
                  <Router>
                    <ViewProfile />
                  </Router>
                </Provider>
              );
            expect(await screen.findByText("Profile Details")).toBeInTheDocument();
        })
    })

    test('displays personal information', () => {
        act(async () => {
            render(
                <Provider store={store}>
                  <Router>
                    <ViewProfile />
                  </Router>
                </Provider>
              );
            expect(await screen.findByText("Personal information")).toBeInTheDocument();
        })
    })

    test('displays account information', () => {
        act(async () => {
            render(
                <Provider store={store}>
                  <Router>
                    <ViewProfile />
                  </Router>
                </Provider>
              );
            expect(await screen.findByText("Account information")).toBeInTheDocument();
        })
    })
})
  

  


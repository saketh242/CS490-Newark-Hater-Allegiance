
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import NHANav from '../components/NHANav';
import App from "../App" 
// import Help from "../components/Help"
// import { MemoryRouter } from 'react-router-dom'; 

import { store } from '../app/store';
import { Provider } from 'react-redux';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useNavigate: () => mockNavigate, 
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(), 
}));



jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signOut: jest.fn().mockResolvedValue(void 0), 
}));


jest.mock('../useAuth', () => ({
  __esModule: true, 
  default: jest.fn(), 
}));

jest.mock('../firebase', () => ({
    auth: {
      signOut: jest.fn(() => Promise.resolve()),
    },
  }));


const renderNHANav = () => render(
  <Provider store={store}>
    <Router>
      <NHANav />
    </Router>
  </Provider>
);

const renderApp = () => render(
    <Provider store={store}>
      <Router>
      <App />
      </Router>
    </Provider>
  );
describe('NHANav', () => {
  beforeEach(() => {

    jest.resetAllMocks();
  });

  it('renders correctly', () => {

    require('../useAuth').default.mockReturnValue({ user: null, isLoading: false });
    renderNHANav();
    expect(screen.getByText('NHAGPT')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Translate')).toBeInTheDocument();
  });

  it('displays login/signup when not authenticated', () => {
    require('../useAuth').default.mockReturnValue({ user: null, isLoading: false });
    renderNHANav();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('displays logout/settings when authenticated', () => {
    require('../useAuth').default.mockReturnValue({ user: { name: 'Jane Doe' }, isLoading: false });
    renderNHANav();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });


});

// Tests for navigation
describe('Navigations', () => {
    test('navigates to the Help page after clicking the Help link', async () => {

        require('../useAuth').default.mockReturnValue({ user: null, isLoading: false });
        renderApp();

        const helpLink = screen.getByRole('link', { name: /help/i });
        userEvent.click(helpLink);

        const uniqueHelpText = await screen.findByText(/How can we help?/i);

        expect(uniqueHelpText).toBeInTheDocument();
    });

    test('navigates to the translate page after clicking the Translate link', async () => {

        require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
        renderApp();

        const helpLink = screen.getByRole('link', { name: /translate/i });
        userEvent.click(helpLink);

        const uniqueHelpText = await screen.findByText(/Getting Started/i);

        expect(uniqueHelpText).toBeInTheDocument();
    });

    test('navigates to the settings page after clicking the Settings link', async () => {

        require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
        renderApp();

        const helpLink = screen.getByRole('link', { name: /settings/i });
        userEvent.click(helpLink);


        expect(uniqueHelpText).toBeInTheDocument();
    });

    test('navigates to the home page page after clicking the brand link', async () => {

      require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
      renderApp();

      const brandLink = screen.getByRole('link', { name: /NHAGPT/i });
      userEvent.click(brandLink);


      const uniqueHelpText = await screen.findByText(/Easy code translation in seconds?/i);

      expect(uniqueHelpText).toBeInTheDocument();
  });


});

  
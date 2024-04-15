
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
import { act } from 'react-dom/test-utils';

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
    act( async () => {
      require('../useAuth').default.mockReturnValue({ user: { name: 'Jane Doe' }, isLoading: false });
      renderNHANav();
      expect(await screen.findByText('Logout')).toBeInTheDocument();
      expect(await screen.findByText('Settings')).toBeInTheDocument();
    });
  });


});

// Tests for navigation
describe('Navigations', () => {
    test('navigates to the Help page after clicking the Help link', () => {
      act(async () => {
        require('../useAuth').default.mockReturnValue({ user: null, isLoading: false });
        renderApp();

        const helpLink = await screen.findByText('Help');
        userEvent.click(helpLink);

        const uniqueHelpText = await screen.findByText("How can we help?");

        expect(uniqueHelpText).toBeInTheDocument();
      });
    });

    test('navigates to the translate page after clicking the Translate link', () => {
      act(async () => {
        require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
        renderApp();
        renderNHANav();

        const helpLink = await screen.findByText("Translate");
        userEvent.click(helpLink);

        const uniqueHelpText = await screen.findByText("Enter code here:");

        expect(uniqueHelpText).toBeInTheDocument();
      });
    });

    test('navigates to the settings page after clicking the Settings link', () => {
      act(async () => {

        require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
        renderApp();

        const helpLink = await screen.findByText('Settings');
        userEvent.click(helpLink);

      const uniqueHelpText = await screen.findByText("Edit profile");

        expect(uniqueHelpText).toBeInTheDocument();
      });
    });

    test('navigates to the home page after clicking the brand link', () => {
      act(async () => {
        require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
        renderApp();
  
        const brandLink = await screen.findByText("NHAGPT");
        userEvent.click(brandLink);
  
  
        const uniqueHelpText = await screen.findByText(/Easy code translation in seconds?/i);
  
        expect(uniqueHelpText).toBeInTheDocument();
      });
  });

  test('navigates to the home page after clicking the logout link', () => {
    act(async () => {
      require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
      renderApp();

      const brandLink = await screen.findByText("Logout");
      userEvent.click(brandLink);


      const uniqueHelpText = await screen.findByText(/Easy code translation in seconds?/i);

      expect(uniqueHelpText).toBeInTheDocument();
    });
  });

  test('navigates to the profile page after clicking the profile link', () => {
    act(async () => {
      require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
      renderApp();

      const brandLink = await screen.findByText("Hi John (👉ﾟヮﾟ)👉");
      userEvent.click(brandLink);


      const uniqueHelpText = await screen.findByText(/Profile Details?/i);

      expect(uniqueHelpText).toBeInTheDocument();
    });
  });
});

  
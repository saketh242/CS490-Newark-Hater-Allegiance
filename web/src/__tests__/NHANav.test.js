// Import React and testing utilities
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import NHANav from '../components/NHANav';
import App from "../App" // Adjust this path as necessary
import Help from "../components/Help"
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter for testing


// Adjusting the mock for useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Spread in actual library exports
  useNavigate: () => mockNavigate, // Now useNavigate is a mock function we can assert on
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain the original functionalities
  useNavigate: () => jest.fn(), // mock useNavigate
}));


// Mock Firebase auth and the useAuth hook
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signOut: jest.fn().mockResolvedValue(void 0), // Ensure this returns a promise
}));


jest.mock('../useAuth', () => ({
  __esModule: true, // This line is important for modules using ES6 exports
  default: jest.fn(), // Mock the default export of useAuth
}));

jest.mock('../firebase', () => ({
    auth: {
      signOut: jest.fn(() => Promise.resolve()),
    },
  }));

// Helper function to render the component within a Router
const renderNHANav = () => render(
  <Router>
    <NHANav />
  </Router>
);

const renderApp = () => render(
      <App />
  );
describe('NHANav', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure a clean slate
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    // Mock `useAuth` for this test to simulate a logged-out state
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

  // Add any additional test cases here
});

// Tests for navigation
describe('Navigations', () => {
    test('navigates to the Help page after clicking the Help link', async () => {
        // Assuming useAuth mock is set up correctly elsewhere
        require('../useAuth').default.mockReturnValue({ user: null, isLoading: false });
        renderApp();

        const helpLink = screen.getByRole('link', { name: /help/i });
        userEvent.click(helpLink);

        // Use findBy to await the appearance of an element unique to the Help page.
        // Adjust the matcher to fit an actual element or text from your Help component.
        const uniqueHelpText = await screen.findByText(/How can we help?/i);

        expect(uniqueHelpText).toBeInTheDocument();
    });

    test('navigates to the translate page after clicking the Translate link', async () => {
        // Assuming useAuth mock is set up correctly elsewhere
        require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
        renderApp();

        const helpLink = screen.getByRole('link', { name: /translate/i });
        userEvent.click(helpLink);

        // Use findBy to await the appearance of an element unique to the Help page.
        // Adjust the matcher to fit an actual element or text from your Help component.
        const uniqueHelpText = await screen.findByText(/OpenAi?/i);

        expect(uniqueHelpText).toBeInTheDocument();
    });

    test('navigates to the settings page after clicking the Settings link', async () => {
        // Assuming useAuth mock is set up correctly elsewhere
        require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
        renderApp();

        const helpLink = screen.getByRole('link', { name: /settings/i });
        userEvent.click(helpLink);

        // Use findBy to await the appearance of an element unique to the Help page.
        // Adjust the matcher to fit an actual element or text from your Help component.
        const uniqueHelpText = await screen.findByText(/Settings?/i);

        expect(uniqueHelpText).toBeInTheDocument();
    });

    test('navigates to the home page page after clicking the brand link', async () => {
      // Assuming useAuth mock is set up correctly elsewhere
      require('../useAuth').default.mockReturnValue({ user: {name:"John Doe"}, isLoading: false });
      renderApp();

      const brandLink = screen.getByRole('link', { name: /NHAGPT/i });
      userEvent.click(brandLink);

      // Use findBy to await the appearance of an element unique to the Help page.
      // Adjust the matcher to fit an actual element or text from your Help component.
      const uniqueHelpText = await screen.findByText(/Easy code translation in seconds?/i);

      expect(uniqueHelpText).toBeInTheDocument();
  });


});

  
  

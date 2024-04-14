import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Help from '../components/Help';

import { store } from '../app/store';
import { Provider } from 'react-redux';

// Mock the toast function
jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

describe('Help Component Tests', () => {
  test('renders the Help component', () => {
    render(
      <Provider store={store}>
        <Router>
          <Help />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId("help-header")).toBeInTheDocument()
  });

  test('renders the guide dropdowns', () => {
    render(
      <Provider store={store}>
        <Router>
          <Help />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/How to get started/i)).toBeInTheDocument()
    expect(screen.getByText(/How to translate/i)).toBeInTheDocument()
    expect(screen.getByText(/How to submit a feedback/i)).toBeInTheDocument()
    expect(screen.getByText(/How to set a profile picture/i)).toBeInTheDocument()
  });

  test('renders the Contact Us', () => {
    render(
      <Provider store={store}>
        <Router>
          <Help />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Send us a message to get additional support!/i)).toBeInTheDocument()
  });

  test('renders the FAQ', () => {
    render(
      <Provider store={store}>
        <Router>
          <Help />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Is NHA GPT free to use?")).toBeInTheDocument()
  });
});

describe('Contact Us', () => {
  test('Error message shows up on empty input in contact form', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Help />
        </Router>
      </Provider>
    );

    // const nameInput = screen.getByPlaceholderText('Your name');
    // const emailInput = screen.getByPlaceholderText('Email');
    // const messageInput = screen.getByPlaceholderText('Your message');
    const sendButton = screen.getByText('Send a message');

    //click without filling any fields
    fireEvent.click(sendButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Please fill out all fields.');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  // test('Toast shows up for successful form submission on contact us', async () => {
  //   render(
  //     <Provider store={store}>
  //       <Router>
  //         <Help />
  //       </Router>
  //     </Provider>
  //   );

  //   const contactButton = screen.getByText("Contact Us");
  //   fireEvent.click(contactButton);

  //   // Fill out the contact form
  //   const nameInput = screen.getByPlaceholderText('Your name');
  //   const emailInput = screen.getByPlaceholderText('Email');
  //   const messageInput = screen.getByPlaceholderText('Your message');
  //   const sendButton = screen.getByText('Send a message');

  //   fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  //   fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
  //   fireEvent.change(messageInput, { target: { value: 'This is a test message.' } });

  //   // Mock the API request
  //   jest.spyOn(global, 'fetch').mockResolvedValueOnce({});

  //   // Click the send button
  //   fireEvent.click(sendButton);

  //   // Wait for the toast to appear
  //   await waitFor(() => {
  //     expect(screen.getByText('Message sent, thank you!')).toBeInTheDocument();
  //   });
  // });
})

describe('Searchable FAQ', () => {
  it('should filter FAQs based on search input', () => {
    render(
      <Provider store={store}>
        <Router>
          <Help />
        </Router>
      </Provider>);

    const searchInput = screen.getByPlaceholderText('Type to search');
    fireEvent.change(searchInput, { target: { value: 'translation' } });

    const filteredFAQs = screen.getAllByTestId('faq-item');
    expect(filteredFAQs).toHaveLength(3);

  });

  it('should display all FAQs if search input is empty', () => {
    render(
      <Provider store={store}>
        <Router>
          <Help />
        </Router>
      </Provider>

    );

    const searchInput = screen.getByPlaceholderText('Type to search');
    fireEvent.change(searchInput, { target: { value: '' } });

    const allFAQs = screen.getAllByTestId('faq-item');
    expect(allFAQs).toHaveLength(5);
  });
});


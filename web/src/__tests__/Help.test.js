import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Help from '../components/Help';

import { store } from '../app/store';
import { Provider } from 'react-redux';

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

  describe('Searchable FAQ', () => {
    it('should filter FAQs based on search input', () => {
      render(
        <Provider store={store}>
          <Router>
            <Help />
          </Router>
        </Provider>);

      // Type in the search input
      const searchInput = screen.getByPlaceholderText('Type to search');
      fireEvent.change(searchInput, { target: { value: 'translation' } });

      // Check if only relevant FAQs are displayed
      const filteredFAQs = screen.getAllByTestId('faq-item');
      expect(filteredFAQs).toHaveLength(3); // Assuming two FAQs contain "translation" in the header
    });

    it('should display all FAQs if search input is empty', () => {
      render(
        <Provider store={store}>
          <Router>
            <Help />
          </Router>
        </Provider>
      );

      // Type in the search input
      const searchInput = screen.getByPlaceholderText('Type to search');
      fireEvent.change(searchInput, { target: { value: '' } });

      // Check if all FAQs are displayed
      const allFAQs = screen.getAllByTestId('faq-item');
      expect(allFAQs).toHaveLength(5); // Assuming there are 5 FAQs in total
    });
  });

  describe('Searchable FAQ', () => {
    it('should filter FAQs based on search input', () => {
      render(
        <Provider store={store}>
          <Router>
            <Help />
          </Router>
        </Provider>
      );

      // Type in the search input
      const searchInput = screen.getByPlaceholderText('Type to search');
      fireEvent.change(searchInput, { target: { value: 'translation' } });

      // Check if only relevant FAQs are displayed
      const filteredFAQs = screen.getAllByTestId('faq-item');
      expect(filteredFAQs).toHaveLength(3); // Assuming two FAQs contain "translation" in the header
    });

    it('should display all FAQs if search input is empty', () => {
      render(
        <Provider store={store}>
          <Router>
            <Help />
          </Router>
        </Provider>
      );

      // Type in the search input
      const searchInput = screen.getByPlaceholderText('Type to search');
      fireEvent.change(searchInput, { target: { value: '' } });

      // Check if all FAQs are displayed
      const allFAQs = screen.getAllByTestId('faq-item');
      expect(allFAQs).toHaveLength(5); // Assuming there are 5 FAQs in total
    });
  });

});






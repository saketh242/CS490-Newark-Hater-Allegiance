import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Help from '../components/Help';

describe('Home Component Tests', () => {
    test('renders the Home component', () => {
      render(
        <Router>
          <Help />
        </Router>
      );
 
      expect(screen.getByText(/Getting Started/i)).toBeInTheDocument()
    });

    test('renders the getting started and feedback dropdowns', () => {
        render(
          <Router>
            <Help />
          </Router>
        );
   
        expect(screen.getByText(/Getting Started/i)).toBeInTheDocument()
        expect(screen.getByText(/How to submit a feedback/i)).toBeInTheDocument()
    
        //expect(screen.getByText(/After you make a translation, you can scroll down to submit feedback/i)).toBeInTheDocument()

      });
      
      describe('Searchable FAQ', () => {
        it('should filter FAQs based on search input', () => {
          render(<Help />);
      
          // Type in the search input
          const searchInput = screen.getByPlaceholderText('Type to search');
          fireEvent.change(searchInput, { target: { value: 'translation' } });
      
          // Check if only relevant FAQs are displayed
          const filteredFAQs = screen.getAllByTestId('faq-item');
          expect(filteredFAQs).toHaveLength(3); // Assuming two FAQs contain "translation" in the header
        });
      
        it('should display all FAQs if search input is empty', () => {
          render(<Help />);
      
          // Type in the search input
          const searchInput = screen.getByPlaceholderText('Type to search');
          fireEvent.change(searchInput, { target: { value: '' } });
      
          // Check if all FAQs are displayed
          const allFAQs = screen.getAllByTestId('faq-item');
          expect(allFAQs).toHaveLength(5); // Assuming there are 5 FAQs in total
        });
      });
      
});
  

  



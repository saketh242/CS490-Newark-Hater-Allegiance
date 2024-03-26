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

    
});
  

  



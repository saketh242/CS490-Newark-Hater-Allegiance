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

    
});
  

  



import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NHANav from '../components/NHANav';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../app/store'; 

describe('NHANav component', () => {
  test('Renders NHANav component', () => {
    render(
      <Provider store={store}>
        <Router>
          <NHANav />
        </Router>
      </Provider>
    );

    expect(screen.getByText('NHAGPT')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Translate')).toBeInTheDocument();

  });
});

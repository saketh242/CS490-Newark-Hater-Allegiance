import React from 'react';
import NHANav from '../components/NHANav';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../app/store'; 
import { act } from 'react-dom/test-utils';
import { render, screen, waitFor } from '@testing-library/react';

test('Renders NHANav component', async () => {
  act(async () => {
    render(
      <Provider store={store}>
        <Router>
          <NHANav />
        </Router>
      </Provider>
    );

    expect(await screen.findByText("NHAGPT")).toBeInTheDocument;
    expect(await screen.findByText("Help")).toBeInTheDocument;
    expect(await screen.findByText("Translate")).toBeInTheDocument;

  });
});


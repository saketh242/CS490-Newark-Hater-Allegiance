import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import nhaService from '../services/nhaService'; 
import Feedback from '../components/Feedback';
import { jest } from '@jest/globals';

import { Provider } from 'react-redux';
import { store } from '../app/store';

describe('Feedback Component', () => {
  test('renders with correct props', async () => {
    const postId = "123";
    render(
      <Provider store={store}>
        <Feedback postId={postId} />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("Rate this translation! We'd love to hear your feedback!")).toBeInTheDocument();
      expect(screen.getByText("Translation Quality")).toBeInTheDocument();
      expect(screen.getByText("User Experience")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter additional feedback here")).toBeInTheDocument();
      expect(screen.getByText("Submit Feedback")).toBeInTheDocument();
    });
  });

  test('displays error message if not all fields are filled', async () => {
    render(
      <Provider store={store}>
        <Feedback postId="123" />
      </Provider>
    );

    fireEvent.click(screen.getByText("Submit Feedback"));
    await waitFor(() => {
      expect(screen.getByText(/please fill out all fields/i)).toBeInTheDocument();
    });
  });

  test('submits feedback when all fields are filled', async () => {
    const postId = "123";
    const { container } = render(
      <Provider store={store}>
        <Feedback postId={postId} />
      </Provider>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Enter additional feedback here"), { target: { value: 'it feedback' } })
    });
    fireEvent.click(container.getElementsByClassName('star')[0])
    fireEvent.click(container.getElementsByClassName('star')[4])

    // Spy on  after importing NHAService
    jest.spyOn(nhaService, 'postFeedback').mockResolvedValue();


    fireEvent.click(screen.getByText("Submit Feedback"));
    await waitFor(() => {
      expect(screen.findByText("Feedback Submitted!"));
    });
  });

  test('displays feedback error message when posting feedback fails', async () => {
    const errorMessage = 'Unable to post feedback.';
    jest.spyOn(nhaService, 'postFeedback').mockRejectedValueOnce(new Error(errorMessage));
  
    const postId = 'testPostId';
  
    render(
      <Provider store={store}>
        <Feedback postId={postId} />
      </Provider>
    );
  
    const feedbackArea = screen.getByPlaceholderText('Enter additional feedback here');

    const waitForSubmitButton = () => screen.getByTestId('submit-feedback');
  
    // const submitButton = screen.getByTestId('submit-feedback');
    setTimeout(() => {
      const submitButton = waitForSubmitButton();

      //simulate user input and clicking submit
      fireEvent.change(feedbackArea, { target: { value: 'Test feedback' } });
      fireEvent.click(submitButton);
  
      // Wait for the error message to appear
      setTimeout(() => {
        const errorElement = getByText(errorMessage);
        expect(errorElement).toBeInTheDocument();
      }, 1000); 
    }, 1000); 
  });
  
});

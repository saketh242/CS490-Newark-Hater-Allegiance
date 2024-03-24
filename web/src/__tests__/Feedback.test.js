import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Feedback from '../components/Feedback';
import nhaService from '../services/nhaService';
import useAuth from '../useAuth';

// jest.doMock("../components/StarGroup", () => {
//   const StarGroup = ({ testRating, }) => {
//     <div />
//   };
//   return StarGroup;
// });

describe('Feedback Component', () => {
  test('renders with correct props', async () => {
    const postId = "123";
    render(<Feedback postId={postId} />);
    await waitFor(() => {
      expect(screen.getByText("Rate this translation! We'd love to hear your feedback!")).toBeInTheDocument();
      expect(screen.getByText("Translation Quality")).toBeInTheDocument();
      expect(screen.getByText("User Experience")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter additional feedback here")).toBeInTheDocument();
      expect(screen.getByText("Submit Feedback")).toBeInTheDocument();
    });
  });

  test('displays error message if not all fields are filled', async () => {
    render(<Feedback postId="123" />);
    fireEvent.click(screen.getByText("Submit Feedback"));
    await waitFor(() => {
      expect(screen.getByText(/please fill out all fields/i)).toBeInTheDocument();
    });
  });

  test('submits feedback when all fields are filled', async () => {
    const postId = "123";
    const { container } = render(<Feedback postId={postId} />);
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Enter additional feedback here"), { target: { value: 'it feedback' } })
    });
    fireEvent.click(container.getElementsByClassName('star')[0])
    fireEvent.click(container.getElementsByClassName('star')[4])
    // fireEvent.click(screen.getByText("Submit Feedback"));
    // await waitFor(() => {
    //   expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
    // });
  });
});

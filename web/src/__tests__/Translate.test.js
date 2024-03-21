import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Translate from '../components/Translate';

describe('Translate component', () => {
  it('renders input and output code areas', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Translate />
        </MemoryRouter>
      );
    });

    // Assert that the input code area is rendered with the correct placeholder text
    expect(screen.getByText('Enter code here:')).toBeInTheDocument();

    // Assert that the output code area is rendered with the correct heading
    expect(screen.getByText('Converted code:')).toBeInTheDocument();
  });
});


// describe('Translate component', () => {
//   test('renders Translate component', () => {
//     <MemoryRouter>
//         render(<Translate />)
//     </MemoryRouter>
    
//   });



//   test('displays error message when input code is empty', async () => {
//     const { getByPlaceholderText, getByText } = render(<Translate />);
//     const inputArea = getByPlaceholderText('Enter code to translate');
//     const translateButton = getByText('Convert');

//     fireEvent.change(inputArea, { target: { value: '' } });
//     fireEvent.click(translateButton);

//     await waitFor(() => {
//       expect(getByText('Input code cannot be empty')).toBeInTheDocument();
//     });
//   });

//   test('updates input code value when typing', () => {
//     const { getByPlaceholderText } = render(<Translate />);
//     const inputArea = getByPlaceholderText('Enter code to translate');

//     fireEvent.change(inputArea, { target: { value: 'console.log("Hello, world!")' } });

//     expect(inputArea.value).toBe('console.log("Hello, world!")');
//   });

//   test('updates source language when selecting from dropdown', () => {
//     const { getByLabelText } = render(<Translate />);
//     const sourceLanguageDropdown = getByLabelText('Source Language:');

//     fireEvent.change(sourceLanguageDropdown, { target: { value: 'javascript' } });

//     expect(sourceLanguageDropdown.value).toBe('javascript');
//   });

//   test('updates desired language when selecting from dropdown', () => {
//     const { getByLabelText } = render(<Translate />);
//     const desiredLanguageDropdown = getByLabelText('Desired Language:');

//     fireEvent.change(desiredLanguageDropdown, { target: { value: 'python' } });

//     expect(desiredLanguageDropdown.value).toBe('python');
//   });

  // Add more tests for different scenarios as needed
// });
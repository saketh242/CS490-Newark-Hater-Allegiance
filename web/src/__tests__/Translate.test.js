import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Translate from '../components/Translate';
import '@testing-library/jest-dom'; // Import this for better assertion messages
import userEvent from '@testing-library/user-event';

import nhaService from '../services/nhaService'

//TODO:
// test empty input
// test copy
// test download
// test translation error message popup

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(), // Mock useNavigate function
}));

// Mock the clipboard API readText and writeText functions
const originalClipboard = navigator.clipboard;
beforeEach(() => {
  navigator.clipboard = {
    ...originalClipboard,
    readText: jest.fn(),
    writeText: jest.fn(),
  };
});
afterEach(() => {
  navigator.clipboard = originalClipboard;
});

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


describe('Translate component', () => {
  test('renders Translate component', () => {
    <MemoryRouter>
        render(<Translate />)
    </MemoryRouter>
    
  });

  // test('displays error message when input code is empty', async () => {
  //   await act(async () => {
  //     render(
  //       <MemoryRouter>
  //         <Translate />
  //       </MemoryRouter>
  //     );
  //   });
  
  //   const inputArea = screen.getByPlaceholderText('Enter code to translate');
  //   const translateButton = screen.getByText('Convert');
  
  //   fireEvent.change(inputArea, { target: { value: '' } });
  //   fireEvent.click(translateButton);
  
  //   // Wait for the error message to appear
  //   await waitFor(() => {
  //     expect(screen.getByText('Input code cannot be empty')).toBeInTheDocument();
  //   });
  // });
  

  test('updates input code value when typing', () => {
    const { getByPlaceholderText } = render(<Translate />);
    const inputArea = getByPlaceholderText('Enter code to translate');

    fireEvent.change(inputArea, { target: { value: 'console.log("Hello, world!")' } });

    expect(inputArea.value).toBe('console.log("Hello, world!")');
  });

  test('updates source language when selecting from dropdown', () => {
    const { getByLabelText } = render(<Translate />);
    const sourceLanguageDropdown = getByLabelText('Source Language:');

    fireEvent.change(sourceLanguageDropdown, { target: { value: 'javascript' } });

    expect(sourceLanguageDropdown.value).toBe('javascript');
  });

  test('updates desired language when selecting from dropdown', () => {
    const { getByLabelText } = render(<Translate />);
    const desiredLanguageDropdown = getByLabelText('Desired Language:');

    fireEvent.change(desiredLanguageDropdown, { target: { value: 'python' } });

    expect(desiredLanguageDropdown.value).toBe('python');
  });

  test('handles short code properly', async () => {
    render(<Translate />);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByText('Convert');
  
    fireEvent.change(inputArea, { target: { value: 'console.log("Short code")' } });
    fireEvent.click(translateButton);
  
    // Wait for the translation process to complete
    await waitFor(() => {
      const outputCode = screen.getByText('Short code', { exact: false }); // Use { exact: false } to match partial text
      expect(outputCode).toBeInTheDocument();
    });
  });
  
  test('handles long code properly', async () => {
    render(<Translate />);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByText('Convert');
  
    // Generate long code (for example purposes, we'll use a simple repetition)
    const longCode = 'console.log("Long code".repeat(100))';
  
    fireEvent.change(inputArea, { target: { value: longCode } });
    fireEvent.click(translateButton);
  
    // Wait for the translation process to complete
    await waitFor(() => {
      // Assert that a part of the long code is present in the output area
      const outputCode = screen.getByText('Long code', { exact: false });
      expect(outputCode).toBeInTheDocument();
    });
  });

  test('should copy translated text to clipboard', async () => {
    const translatedCode = 'console.log("Translated code")';
    render(<Translate />);
  
    //Simulate translation process completion
    // await waitFor(() => {
    //   expect(screen.getByText(translatedCode)).toBeInTheDocument();
    // });
  
    // Click the copy button
    userEvent.click(screen.getByTitle('Copy code'));
  
    // // Wait for a short delay
    // await pause(10);
  
    // // Read the text from the clipboard
    // const copiedText = await navigator.clipboard.readText();
  
    // // Expect the copied text to match the translated code
    // expect(copiedText).toEqual(translatedCode);

        // // Wait for the copy process to complete
        // await waitFor(() => {
        //   const copied = screen.getByText('Copied to clipboard!');
        //   expect(copied).toBeInTheDocument();
        // });
  });
  
  async function pause(delay) {
    return await new Promise(resolve => setTimeout(resolve, delay));
  }

  test('displays translation error message when translation fails', async () => {
    // // Mock the service function to return a failure response
    // jest.spyOn(nhaService, 'postPrompt').mockResolvedValueOnce({ success: false, message: 'Translation failed' });
  
    // Render the component
    render(<Translate />);
  
    // // Enter input code and initiate translation
    // const inputArea = screen.getByPlaceholderText('Enter code to translate');
    // const translateButton = screen.getByText('Convert');
    // fireEvent.change(inputArea, { target: { value: 'console.log("Invalid code")' } });
    // fireEvent.click(translateButton);
  
    // // Wait for the translation process to complete and the error message to appear
    // await waitFor(() => {
    //   expect(screen.queryByText('Translation failed')).toBeInTheDocument();
    // });
  });
  
});


const { sanitizeCode } = require('../utils/codeUtils');

describe('sanitizeCode function', () => {
  it('should remove leading and trailing whitespace', () => {
    const code = '   const x;   ';
    const sanitizedCode = sanitizeCode(code, 'javascript');
    expect(sanitizedCode).toEqual('const x;');
  });

  it('should remove unnecessary trailing semicolons for Python', () => {
    const code = 'print(5);;;;;;';
    const sanitizedCode = sanitizeCode(code, 'python');
    expect(sanitizedCode).toEqual('print(5)');
  });

  it('should keep one trailing semicolon for other languages', () => {
    const code = 'int x;;;;;;';
    const sanitizedCode = sanitizeCode(code, 'java');
    expect(sanitizedCode).toEqual('int x;');
  });
  
});

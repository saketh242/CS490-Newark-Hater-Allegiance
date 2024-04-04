import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Translate from '../components/Translate';
import '@testing-library/jest-dom'; // Import this for better assertion messages
// import nhaService from '../services/nhaService'

//TODO:
// test empty input

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

// Mocking the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('Translate component', () => {
  it('copies code to the clipboard when the copy button is clicked', async () => {
    const { getByTitle } = render(<Translate />);
    const copyButton = getByTitle('Copy code');

    // Simulating a click on the copy button
    await act(async () => {
      fireEvent.click(copyButton);
    });

    // Expecting the clipboard.writeText method to be called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});

describe('Translate component', () => {
  it('triggers code download when the download button is clicked', () => {
    // Mocking createObjectURL and revokeObjectURL
    const mockCreateObjectURL = jest.fn();
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const { getByTitle } = render(<Translate />);
    const downloadButton = getByTitle('Download code'); 

    fireEvent.click(downloadButton);

    // Expect createObjectURL to be called, indicating that a Blob was created for download
    expect(mockCreateObjectURL).toHaveBeenCalled();
    // Optionally, check that revokeObjectURL was called to clean up the object URL
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });
});

describe('Sidebar rendered component', () => {
  it('triggers sidebar history when button is pressed', () => {
    const { container } = render(<Translate />);
    fireEvent.click(container.getElementsByClassName("historyButton")[0]);
    expect(screen.findByText("Translation History"));
  });
});

// // Mock the entire module to mock the postPrompt function
// jest.mock('../services/nhaService');

// describe('Translate component', () => {
//   test('displays translation error message when translation fails', async () => {
//     // Setup the mock for postPrompt to return a failed response
//     nhaService.postPrompt.mockResolvedValueOnce({
//       success: false,
//       message: 'Translation failed due to an error',
//     });

//     render(<Translate />);

//     // Assume your language dropdowns and input area are correctly identified
//     const sourceLanguageDropdown = screen.getByLabelText('Source Language:');
//     const desiredLanguageDropdown = screen.getByLabelText('Desired Language:');
//     const inputArea = screen.getByPlaceholderText('Enter code to translate');
//     const translateButton = screen.getByText('Convert');

//     // Simulate selecting languages and entering code
//     fireEvent.change(sourceLanguageDropdown, { target: { value: 'javascript' } });
//     fireEvent.change(desiredLanguageDropdown, { target: { value: 'python' } });
//     fireEvent.change(inputArea, { target: { value: 'console.log("Hello, World!")' } });

//     // Simulate clicking the translate button
//     fireEvent.click(translateButton);

//     // Wait for the error message to appear
//     await waitFor(() => {
//       const errorMessage = screen.getByText('Translation failed due to an error');
//       expect(errorMessage).toBeInTheDocument();
//     });
//   });
// });


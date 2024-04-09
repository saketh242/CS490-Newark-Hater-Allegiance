import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Translate from '../components/Translate';
import '@testing-library/jest-dom'; // Import this for better assertion messages
import nhaService from '../services/nhaService'

import { store } from '../app/store';
import { Provider } from 'react-redux';

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
        <Provider store={store}>
          <Translate />
        </Provider>
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
        render(<Provider store={store}><Translate /></Provider>)
    </MemoryRouter>
    
  });

  test('updates input code value when typing', () => {
    const { getByPlaceholderText } = render(<Provider store={store}><Translate /></Provider>);
    const inputArea = getByPlaceholderText('Enter code to translate');

    fireEvent.change(inputArea, { target: { value: 'console.log("Hello, world!")' } });

    expect(inputArea.value).toBe('console.log("Hello, world!")');
  });

  test('updates source language when selecting from dropdown', () => {
    const { getByLabelText } = render(<Provider store={store}><Translate /></Provider>);
    const sourceLanguageDropdown = getByLabelText('Source Language:');

    fireEvent.change(sourceLanguageDropdown, { target: { value: 'javascript' } });

    expect(sourceLanguageDropdown.value).toBe('javascript');
  });

  test('updates desired language when selecting from dropdown', () => {
    const { getByLabelText } = render(<Provider store={store}><Translate /></Provider>);
    const desiredLanguageDropdown = getByLabelText('Desired Language:');

    fireEvent.change(desiredLanguageDropdown, { target: { value: 'python' } });

    expect(desiredLanguageDropdown.value).toBe('python');
  });

  test('handles short code properly', async () => {
    render(<Provider store={store}><Translate /></Provider>);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByTestId('Convert');
  
    fireEvent.change(inputArea, { target: { value: 'console.log("Short code")' } });
    fireEvent.click(translateButton);
  
    // Wait for the translation process to complete
    await waitFor(() => {
      const outputCode = screen.getByText('Short code', { exact: false }); // Use { exact: false } to match partial text
      expect(outputCode).toBeInTheDocument();
    });
  });
  
  test('handles long code properly', async () => {
    render(<Provider store={store}><Translate /></Provider>);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByTestId('Convert');
  
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
    const errorMessage = 'Translation failed due to an error';
    jest.spyOn(nhaService, 'postPrompt').mockResolvedValueOnce({ success: false, message: errorMessage });
  
    const { getByPlaceholderText, getByTestId, getByText } = render(<Provider store={store}><Translate /></Provider>);
    const inputArea = getByPlaceholderText('Enter code to translate');
  
    // Function to check if the convert button is available
    const waitForConvertButton = () => getByTestId('Convert');
  
    // Wait for the convert button to appear with a timeout
    setTimeout(() => {
      const translateButton = waitForConvertButton();
  
      // Simulate user input and click on translate button
      fireEvent.change(inputArea, { target: { value: 'console.log("Hello, World!")' } });
      fireEvent.click(translateButton);
  
      // Wait for the error message to appear
      setTimeout(() => {
        const errorElement = getByText(errorMessage);
        expect(errorElement).toBeInTheDocument();
      }, 1000); // Adjust the timeout as needed
    }, 1000); // Adjust the timeout as needed
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
    const { getByTitle } = render(<Provider store={store}><Translate /></Provider>);
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

    const { getByTitle } = render(<Provider store={store}><Translate /></Provider>);
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
    const { container } = render(
      <Provider store={store}>
        <Translate />
      </Provider>
    );
    fireEvent.click(container.getElementsByClassName("historyButton")[0]);
    expect(screen.findByText("Translation History"));
  });
});


describe('Translate component', () => {
  test('handles various code structures properly', async () => {
    render(<Provider store={store}><Translate /></Provider>);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByTestId('Convert');
  
    // Different code structures to test
    const codeStructures = [
      'console.log("Hello, world!");', // Basic console log
      'for (let i = 0; i < 10; i++) { console.log(i); }', // For loop
      'function add(a, b) { return a + b; }', // Function declaration
      'const numbers = [1, 2, 3, 4, 5]; numbers.forEach(num => console.log(num));', // Array iteration
      'class Person { constructor(name) { this.name = name; } sayHello() { console.log(`Hello, my name is ${this.name}.`); } }', // Class declaration
      'const promise = new Promise((resolve, reject) => { setTimeout(() => resolve("Done!"), 1000); }); promise.then(result => console.log(result));', // Promise
      // Add more code structures to test as needed
    ];
  
    // Iterate over each code structure and test
    for (const code of codeStructures) {
      fireEvent.change(inputArea, { target: { value: code } });
      fireEvent.click(translateButton);
  
      // Wait for the translation process to complete
      await waitFor(() => {
        // Assert that a part of the code is present in the output area
        const outputCode = screen.getByText(code.split(' ')[0], { exact: false }); // Check only the first word for simplicity
        expect(outputCode).toBeInTheDocument();
      });
  
      // Clear input for the next iteration
      fireEvent.change(inputArea, { target: { value: '' } });
    }
  });
});

describe('Translate component', () => {
  test('handles input validation and successful submission', async () => {
    const { getByPlaceholderText, getByTestId, queryByText } = render(<Provider store={store}><Translate /></Provider>);
    const inputArea = getByPlaceholderText('Enter code to translate');
    const translateButton = getByTestId('Convert');
  
    // Test empty input
    // fireEvent.click(translateButton);
    // expect(queryByText('Please enter code to translate.')).toBeInTheDocument();
    
    // Test successful submission
    fireEvent.change(inputArea, { target: { value: 'console.log("Hello, world!")' } });
    fireEvent.click(translateButton);
  
    // Wait for the translation process to complete
    await waitFor(() => {
      // Assert that a part of the translated code is present in the output area
      const outputCode = screen.getByText('Hello, world!', { exact: false }); 
      expect(outputCode).toBeInTheDocument();
    });
  });
});

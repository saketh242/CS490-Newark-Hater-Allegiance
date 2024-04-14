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

  test('updates input code value when typing', async () => {
    const { getByPlaceholderText } = render(<Provider store={store}><Translate /></Provider>);
    const inputArea = getByPlaceholderText('Enter code to translate');

    await act(async () => {
      fireEvent.change(inputArea, { target: { value: 'console.log("Hello, world!")' } });
    });
    expect(inputArea.value).toBe('console.log("Hello, world!")');
  });

  test('updates source language when selecting from dropdown', async () => {
    const { getByLabelText } = render(<Provider store={store}><Translate /></Provider>);
    const sourceLanguageDropdown = getByLabelText('Source Language:');

    await act(async() => {    
      fireEvent.change(sourceLanguageDropdown, { target: { value: 'javascript' } });
    });

    expect(sourceLanguageDropdown.value).toBe('javascript');
  });

  test('updates desired language when selecting from dropdown', async () => {
    const { getByLabelText } = render(<Provider store={store}><Translate /></Provider>);
    const desiredLanguageDropdown = getByLabelText('Desired Language:');

    await act(async() => {
      fireEvent.change(desiredLanguageDropdown, { target: { value: 'python' } });
    });

    expect(desiredLanguageDropdown.value).toBe('python');
  });

  test('handles short code properly', async () => {
    render(<Provider store={store}><Translate /></Provider>);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByTestId('Convert');
  
    await act(async () => {
      fireEvent.change(inputArea, { target: { value: 'console.log("Short code")' } });
      fireEvent.click(translateButton);
    });
  
    // Wait for the translation process to complete
    await waitFor(() => {
      const outputCode = screen.getByText('Short code', { exact: false });
      expect(outputCode).toBeInTheDocument();
    });
  });
  
  test('handles long code properly', async () => {
    render(<Provider store={store}><Translate /></Provider>);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByTestId('Convert');
  
    // Generate long code (for example purposes, we'll use a simple repetition)
    const longCode = 'console.log("Long code".repeat(100))';
  
    await act(async() => {    
      fireEvent.change(inputArea, { target: { value: longCode } });
    });

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
  
    const translateButton = getByTestId('Convert');
    await act(async() => {
      fireEvent.change(inputArea, { target: { value: 'console.log("Hello, World!")' } });
      fireEvent.click(translateButton);
    });
  
      setTimeout(() => {
        const errorElement = getByText(errorMessage);
        expect(errorElement).toBeInTheDocument();
      }, 1000); 
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

    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});

describe('Translate component', () => {
  it('triggers code download when the download button is clicked', async () => {
    // Mocking createObjectURL and revokeObjectURL
    const mockCreateObjectURL = jest.fn();
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const { getByTitle } = render(<Provider store={store}><Translate /></Provider>);
    const downloadButton = getByTitle('Download code'); 

    await act(async() => {
      fireEvent.click(downloadButton);
    });

    // Expect createObjectURL to be called, indicating that a Blob was created for download
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });
});

describe('Sidebar rendered component', () => {
  it('triggers sidebar history when button is pressed', async () => {
      const { container } = render(
        <Provider store={store}>
          <Translate />
        </Provider>
      );

      await act(async() => {
        fireEvent.click(container.getElementsByClassName("historyButton")[0]);
      });
      expect(screen.findByText("Translation History"));
  });
});


describe('Translate component', () => {
  test('handles various code structures properly', async () => {
    render(<Provider store={store}><Translate /></Provider>);
    const inputArea = screen.getByPlaceholderText('Enter code to translate');
    const translateButton = screen.getByTestId('Convert');
  
    const codeStructures = [
      'cout << "Hello World!";', //C++
      `using System;

      class Program
      {
          static void Main(string[] args)
          {
              // Loop from 1 to 10
              for (int i = 1; i <= 10; i++)
              {
                  Console.WriteLine("Iteration " + i);
              }
          }
      }      
      `, //C#
      '$fruits = array("Apple", "Banana", "Orange", "Mango");', //PHP
      'puts "Here is some ruby code"', //RUBY
      'let message: string = "Hello, World!";', //TYPESCRIPT
      'def my_function(): print("Hello from a function")',  //PYTHON
      'int[] numbers = {1, 2, 3, 4, 5}; for(int i : numbers) System.out.println(i);', //JAVA
      'class Person { constructor(name) { this.name = name; } sayHello() { console.log(`Hello, my name is ${this.name}.`); } }', //JAVASCRIPT
      
      `#include <stdio.h> 
       int main() {
        printf(%d, 2+2);
        return 0;
       }`, //C

      `package main

      import "fmt"
      
      func main() {
      
          var a = "initial"
          fmt.Println(a)
      
          var b, c int = 1, 2
          fmt.Println(b, c)
      
          var d = true
          fmt.Println(d)
      
          var e int
          fmt.Println(e)
      
          f := "apple"
          fmt.Println(f)
      }` //GO
    ];
  
    // Iterate over each code structure and test
    for (const code of codeStructures) {
      await act(async() => {
        fireEvent.change(inputArea, { target: { value: code } });
        fireEvent.click(translateButton);
      });
  
      await waitFor(() => {
        const outputCode = screen.getByText(code.split(' ')[0], { exact: false });
        expect(outputCode).toBeInTheDocument();
      });
  
      // Clear input for the next iteration
      await act(async() => {
        fireEvent.change(inputArea, { target: { value: '' } });
      });
    }
  });
});

describe('Translate component', () => {
  test('handles input validation and successful submission', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<Provider store={store}><Translate /></Provider>);
    const inputArea = getByPlaceholderText('Enter code to translate');
    const translateButton = getByTestId('Convert');
  
    // Test empty input
    // fireEvent.click(translateButton);
    // expect('Input code cannot be empty').toBeInTheDocument();
    
    // Test successful submission
    await act(async() => {
      fireEvent.change(inputArea, { target: { value: 'console.log("Hello, world!")' } });
      fireEvent.click(translateButton);
    });
  
    // Wait for the translation process to complete
    await waitFor(() => {
      // Assert that a part of the translated code is present in the output area
      const outputCode = screen.getByText('Hello, world!', { exact: false }); 
      expect(outputCode).toBeInTheDocument();
    });
  });
});

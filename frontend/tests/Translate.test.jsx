import { render, screen, fireEvent, waitFor } from '@testing-library/react';
//import fireEvent for user triggered events such as: click, change, input, keyboard, form submission
import Translate from '../src/components/Translate/Translate';
import { MemoryRouter } from 'react-router-dom';

describe('Translate', () => {
  it('renders the Translate component', () => {
    render(<Translate />, { wrapper: MemoryRouter });

    // Assert that the Translate component renders without errors
    expect(screen.getByText('Enter code here:')).toBeInTheDocument();
  });

  it('accepts typed code input', async () => {
    render(<Translate />, { wrapper: MemoryRouter });

    // Simulate typing code input into the textarea
    const inputTextarea = screen.getByPlaceholderText('Enter code to translate');
    fireEvent.change(inputTextarea, { target: { value: 'print("Hello, World!")' } });

    // Assert that the input code is reflected in the textarea
    expect(inputTextarea).toHaveValue('print("Hello, World!")');
  });

  it('accepts uploaded file with code content', async () => {
    render(<Translate />, { wrapper: MemoryRouter });

    // Simulate uploading a file with code content
    const file = new File(['console.log("File uploaded!")'], 'example.js', { type: 'text/javascript' });
    const fileInput = screen.getByTestId('file-input'); // Use data-testid instead of label text
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Assert that the uploaded file content is reflected in the textarea after some time
    await waitFor(() => {
      const inputTextarea = screen.getByPlaceholderText('Enter code to translate');
      expect(inputTextarea).toHaveValue('console.log("File uploaded!")');
    });
  });
});

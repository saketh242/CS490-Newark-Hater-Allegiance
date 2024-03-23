import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import History from './History';

describe('History component', () => {
  const mockHistory = [
    {
      createdAt: '2024-03-22T12:30:00',
      Source_language: 'English',
      Desired_language: 'Spanish',
      original_code: 'console.log("Hello, world!")',
      converted_code: 'console.log("¡Hola, mundo!")',
    },
    {
      createdAt: '2024-03-21T15:45:00',
      Source_language: 'French',
      Desired_language: 'German',
      original_code: 'print("Bonjour le monde!")',
      converted_code: 'print("Hallo Welt!")',
    },
  ];

  it('renders the History component with provided history data', () => {
    const { getByText } = render(
      <History
        history={mockHistory}
        showSidebar={true}
        toggleSidebar={() => {}}
        setInputCode={() => {}}
      />
    );

    expect(getByText('Translation History')).toBeInTheDocument();

    mockHistory.forEach((item) => {
      expect(getByText(item.Source_language)).toBeInTheDocument();
      expect(getByText(item.Desired_language)).toBeInTheDocument();
      expect(getByText(item.original_code)).toBeInTheDocument();
      expect(getByText(item.converted_code)).toBeInTheDocument();
    });
  });

  it('calls setInputCode with correct code when Load Source Code button is clicked', () => {
    const mockSetInputCode = jest.fn();
    const { getByText } = render(
      <History
        history={mockHistory}
        showSidebar={true}
        toggleSidebar={() => {}}
        setInputCode={mockSetInputCode}
      />
    );

    fireEvent.click(getByText('Load Source Code'));
    expect(mockSetInputCode).toHaveBeenCalledWith(mockHistory[0].original_code);
  });

  it('calls setInputCode with correct code when Load Translated Code button is clicked', () => {
    const mockSetInputCode = jest.fn();
    const { getByText } = render(
      <History
        history={mockHistory}
        showSidebar={true}
        toggleSidebar={() => {}}
        setInputCode={mockSetInputCode}
      />
    );

    fireEvent.click(getByText('Load Translated Code'));
    expect(mockSetInputCode).toHaveBeenCalledWith(mockHistory[0].converted_code);
  });

  it('does not render anything when history is null or showSidebar is false', () => {
    const { container } = render(
      <History
        history={null}
        showSidebar={false}
        toggleSidebar={() => {}}
        setInputCode={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});


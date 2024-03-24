import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import History from '../components/History';

const dateAndTimeConversion = (date) => {
  const dateObject = new Date(date);
  const string = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  });
  return string;
};

describe('History component', () => {
  const mockHistory = [
    {
      createdAt: '2024-03-23T10:30:00Z',
      Source_language: 'javascript',
      Desired_language: 'python',
      original_code: 'console.log("Hello, world!");',
      converted_code: 'print("Hello, world!")',
    },
    {
      createdAt: '2024-03-22T15:45:00Z',
      Source_language: 'c',
      Desired_language: 'java',
      original_code: 'printf("Hello, world!");',
      converted_code: 'System.out.println("Hello, world!");',
    },
  ];

  const mockSetInputCode = jest.fn();
  const mockSetTranslatedCode = jest.fn();

  test('renders correctly with history data and sidebar activated', () => {
    const { getByText, getAllByText } = render(
      <History
        history={mockHistory}
        showSidebar={true}
        toggleSidebar={() => {}}
        setInputCode={mockSetInputCode}
        setTranslatedCode={mockSetTranslatedCode}
      />
    );

    expect(getByText('Translation History')).toBeInTheDocument();

    const loadButtons = getAllByText("Load Code");
    expect(loadButtons.length).toBeGreaterThan(0);

    mockHistory.forEach(historyItem => {
      expect(getByText(dateAndTimeConversion(historyItem.createdAt))).toBeInTheDocument();
      expect(getByText("Source Code (" + historyItem.Source_language + ")")).toBeInTheDocument();
      expect(getByText("Converted Code (" + historyItem.Desired_language + ")")).toBeInTheDocument();
      expect(getByText(historyItem.original_code)).toBeInTheDocument();
      expect(getByText(historyItem.converted_code)).toBeInTheDocument();
    });
  });

  test('does not render anything when history is null', () => {
    const { container } = render(
      <History
        history={null}
        showSidebar={true}
        toggleSidebar={() => {}}
        setInputCode={mockSetInputCode}
        setTranslatedCode={mockSetTranslatedCode}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('does not render anything when sidebar is supposed to be hidden with valid history', () => {
    const { container } = render(
      <History
        history={mockHistory}
        showSidebar={false}
        toggleSidebar={() => {}}
        setInputCode={mockSetInputCode}
        setTranslatedCode={mockSetTranslatedCode}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('setInputCode and setTranslatedCode send the right data when Load Code buttons are clicked', () => {
    const { getAllByText } = render(

        <History
          history={mockHistory}
          showSidebar={true}
          toggleSidebar={() => {}}
          setInputCode={mockSetInputCode}
          setTranslatedCode={mockSetTranslatedCode}
        />
    );

    const loadButtons = getAllByText("Load Code");

    for (let i = 0; i < loadButtons.length; i++) {
      fireEvent.click(loadButtons[i]);
      expect(mockSetInputCode).toHaveBeenCalledWith(mockHistory[i].original_code);
      expect(mockSetTranslatedCode).toHaveBeenCalledWith(mockHistory[i].converted_code);
    }
  });
});

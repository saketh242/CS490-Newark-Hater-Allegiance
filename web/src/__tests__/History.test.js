import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import History from '../components/History';

import { store } from '../app/store';
import { Provider } from 'react-redux';

//TODO:
//clear all history
//clear one history
//sort and filter

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
  const mockSetSourceLanguage = jest.fn();
  const mockSetDesiredLanguage = jest.fn();

  test('renders correctly with history data and sidebar activated', () => {
    act(async () => {
      render(
        <Provider store={store}>
          <History
            history={mockHistory}
            showSidebar={true}
            toggleSidebar={() => { }}
            setInputCode={mockSetInputCode}
            setTranslatedCode={mockSetTranslatedCode}
            setSourceLanguage={mockSetSourceLanguage}
            setDesiredLanguage={mockSetDesiredLanguage}
          />
        </Provider>
      );

      expect(await screen.findByText('Translation History')).toBeInTheDocument();

      const loadButtons = await findAllByTest("translateAgain");
      expect(loadButtons.length).toBeGreaterThan(0);
  
      mockHistory.forEach(historyItem => {
        expect(screen.getByText(dateAndTimeConversion(historyItem.createdAt))).toBeInTheDocument();
        expect(screen.getByText("Source Code (" + historyItem.Source_language + ")")).toBeInTheDocument();
        expect(screen.getByText("Converted Code (" + historyItem.Desired_language + ")")).toBeInTheDocument();
        expect(screen.getByText(historyItem.original_code)).toBeInTheDocument();
        expect(screen.getByText(historyItem.converted_code)).toBeInTheDocument();
      });
    });
  });

  test('does not render anything when history is null', () => {
    act(() => {
      const { container } = render(
        <Provider store={store}>
          <History
            history={null}
            showSidebar={true}
            toggleSidebar={() => { }}
            setInputCode={mockSetInputCode}
            setTranslatedCode={mockSetTranslatedCode}
            setSourceLanguage={mockSetSourceLanguage}
            setDesiredLanguage={mockSetDesiredLanguage}
          />
        </Provider>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  test('does not render anything when sidebar is supposed to be hidden with valid history', () => {
    act(() => {
      const { container } = render(
        <Provider store={store}>
          <History
            history={mockHistory}
            showSidebar={false}
            toggleSidebar={() => { }}
            setInputCode={mockSetInputCode}
            setTranslatedCode={mockSetTranslatedCode}
            setSourceLanguage={mockSetSourceLanguage}
            setDesiredLanguage={mockSetDesiredLanguage}
          />
        </Provider>
      );
      expect(container.firstChild).toBeNull();
    });
  });

  test('setInputCode and setTranslatedCode send the right data when Translate again buttons are clicked', () => {
    act(async () => {
      render(
        <Provider store={store}>
          <History
            history={mockHistory}
            showSidebar={true}
            toggleSidebar={() => { }}
            setInputCode={mockSetInputCode}
            setTranslatedCode={mockSetTranslatedCode}
            setSourceLanguage={mockSetSourceLanguage}
            setDesiredLanguage={mockSetDesiredLanguage}
          />
        </Provider>
      );

      const loadButtons = await screen.findAllByTestId("translateAgain");

      for (let i = 0; i < loadButtons.length; i++) {
        fireEvent.click(loadButtons[i]);
        expect(mockSetInputCode).toHaveBeenCalledWith(mockHistory[i].original_code);
        expect(mockSetTranslatedCode).toHaveBeenCalledWith(mockHistory[i].converted_code);
      }
    });
  });


  test('displays error message when history retrieval fails', () => {
    act(async () => {
          const errorMessage = 'Unable to retrieve history at this time.';
    
    render(
      <Provider store={store}>
        <History
          showSidebar={true}
          triggerHistory={true} // Simulate error by triggering history retrieval
          setTriggerHistory={() => {}} // Set an empty function to prevent actual retrieval
          setInputCode={mockSetInputCode}
          setTranslatedCode={mockSetTranslatedCode}
          setSourceLanguage={mockSetSourceLanguage}
          setDesiredLanguage={mockSetDesiredLanguage}
        />
      </Provider>
    );

    // Check if the error message is displayed
    const element = await screen.findByTestId("historyError");
    expect(element).toBeInTheDocument();
    });
  });


  test('displays correct elements when history is empty', async () => {
    await render(
      <Provider store={store}>
        <History
          history={[]} // Empty history
          showSidebar={true}
          toggleSidebar={() => { }}
          setInputCode={mockSetInputCode}
          setTranslatedCode={mockSetTranslatedCode}
          setSourceLanguage={mockSetSourceLanguage}
          setDesiredLanguage={mockSetDesiredLanguage}
        />
      </Provider>
    );

      // const emptyHistoryText = await screen.getByText("No past translations");      
      // expect(emptyHistoryText).toBeInTheDocument();
  });

});

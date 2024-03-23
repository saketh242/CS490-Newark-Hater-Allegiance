// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import History from '../components/History';

// describe('History component', () => {
//   const mockHistory = [
//     {
//       createdAt: '2024-03-23T10:30:00Z',
//       Source_language: 'javascript',
//       Desired_language: 'python',
//       original_code: 'console.log("Hello, world!");',
//       converted_code: 'print("Hello, world!")',
//     },
//     {
//       createdAt: '2024-03-22T15:45:00Z',
//       Source_language: 'python',
//       Desired_language: 'javascript',
//       original_code: 'print("Hello, world!")',
//       converted_code: 'console.log("Hello, world!");',
//     },
//   ];

//   const mockSetInputCode = jest.fn();
//   const mockSetTranslatedCode = jest.fn();

//   it('renders correctly with history data and sidebar shown', () => {
//     const { getByText } = render(
//       <History
//         history={mockHistory}
//         showSidebar={true}
//         toggleSidebar={() => {}}
//         setInputCode={mockSetInputCode}
//         setTranslatedCode={mockSetTranslatedCode}
//       />
//     );

//     expect(getByText('Translation History')).toBeInTheDocument();

//     mockHistory.forEach(historyItem => {
//       expect(getByText("Source Code (" + historyItem.Source_language + ")")).toBeInTheDocument;
//       expect(getByText("Source Code (" + historyItem.Desired_language + ")")).toBeInTheDocument();
//       expect(getByText(historyItem.original_code)).toBeInTheDocument();
//       expect(getByText(historyItem.converted_code)).toBeInTheDocument();
//     });
//   });

//   it('does not render anything when history is null or sidebar is not shown', () => {
//     const { container } = render(
//       <History
//         history={null}
//         showSidebar={false}
//         toggleSidebar={() => {}}
//         setInputCode={mockSetInputCode}
//         setTranslatedCode={mockSetTranslatedCode}
//       />
//     );

//     expect(container.firstChild).toBeNull();
//   });

//   it('calls setInputCode and setTranslatedCode when Load Code button is clicked', () => {
//     const { getByText } = render(
//       <History
//         history={mockHistory}
//         showSidebar={true}
//         toggleSidebar={() => {}}
//         setInputCode={mockSetInputCode}
//         setTranslatedCode={mockSetTranslatedCode}
//       />
//     );

//     fireEvent.click(getByText('Load Code'));
//     expect(mockSetInputCode).toHaveBeenCalledWith(mockHistory[0].original_code);
//     expect(mockSetTranslatedCode).toHaveBeenCalledWith(mockHistory[0].converted_code);
//   });
// });

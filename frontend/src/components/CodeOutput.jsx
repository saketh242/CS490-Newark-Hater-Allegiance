import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const CodeOutput = ({ code, language }) => {
        // Custom style object to change background color
        const customDracula = {
            ...dracula,
            'hljs': {
                ...dracula['hljs'],
                background: '#23262F',
            },
        };

    return (
        <div className="codeOutput">
            <SyntaxHighlighter language={language} style={customDracula}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeOutput;

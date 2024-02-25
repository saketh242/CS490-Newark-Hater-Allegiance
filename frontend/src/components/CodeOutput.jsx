import SyntaxHighlighter from 'react-syntax-highlighter';

const CodeOutput = ({codeString, language}) => {
  return (
    <SyntaxHighlighter language={language}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default CodeOutput;
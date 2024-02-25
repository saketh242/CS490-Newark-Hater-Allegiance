import React, { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import CodeOutput from './CodeOutput';

const Translate = () => {
  const [inputCode, setInputCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');

  // translation function
  const translateCode = () => {
    //translation logic
    setTranslatedCode(inputCode);
  }

  return (
    <div className="translateBody">
      <h1 className="apiStatus">OpenAI API Status: </h1>
      <div className="dropdown">
        <select id="originLanguage">
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
        </select>
        <button onClick={translateCode}>Translate</button>
        <select id="desiredLanguage">
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
        </select>
      </div>
      <button>Upload</button>
      <div className="codeBlocks">
        <textarea className="inputArea"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter code to translate"
        />
        <CodeOutput className="outputArea" language="javascript" codeString="sample"/>
      </div>
    </div>
  )
}

export default Translate

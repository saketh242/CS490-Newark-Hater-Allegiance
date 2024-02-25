import React, { useState } from 'react'
import CodeOutput from './CodeOutput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong, faArrowRightLong, faDownload, faCopy } from '@fortawesome/free-solid-svg-icons'

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
          <option value="cplusplus">C++</option>
          <option value="php">PHP</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="typescript">TypeScript</option>
        </select>

        <div className="conversionArrow">
          <FontAwesomeIcon id="icons" icon={faArrowRightLong} size="5x"/>
          <button onClick={translateCode}>Translate</button>
        </div>

        <select id="desiredLanguage">
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cplusplus">C++</option>
          <option value="php">PHP</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      <div className="upload"><button>Upload File</button></div>

      <div className="codeBlocks">
        <div className="src">
          <h2>Enter code here:</h2>
          <textarea className="inputArea"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter code to translate"
          />
        </div>
        <div className="dest">
          <h2>Converted code:</h2>
          {/* <FontAwesomeIcon icon={faDownload} />
          <FontAwesomeIcon icon={faCopy} /> */}
          <div className="outputArea">
            <CodeOutput/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Translate;

import React, { useState } from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import CodeOutput from './CodeOutput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {faDownload, faCopy, faFileImport } from '@fortawesome/free-solid-svg-icons'

const Translate = () => {
  // API icon, testing purposes
  const [apiReady, setApiReady] = useState(true);

  const [inputCode, setInputCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');

  const [sourceLanguage, setSourceLanguage] = useState('python'); 
  const [desiredLanguage, setDesiredLanguage] = useState('python'); // Default language

  const handleSourceLanguageChange = (e) => {
    setSourceLanguage(e.target.value);
  };

  const handleDesiredLanguageChange = (e) => {
    setDesiredLanguage(e.target.value);
  };

  // translation function
  const translateCode = () => {
    //translation logic
    setTranslatedCode(inputCode);
  }

    //array of available programming languages
    const languages = [
      { value: 'python', label: 'Python' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' },
      { value: 'cplusplus', label: 'C++' },
      { value: 'php', label: 'PHP' },
      { value: 'go', label: 'Go' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'typescript', label: 'TypeScript' }
    ];



  return (
    <div className="translateBody">
        <h1 className="apiStatus">
          OpenAI API Status: 
          {apiReady ? (
            <FontAwesomeIcon icon={faCheckCircle} size="2x" style={{ color: 'green', marginLeft: '1rem' }} />
          ) : (
            <FontAwesomeIcon icon={faTimesCircle} size="2x" style={{ color: 'red', marginLeft: '1rem' }} />
          )}
      </h1>

      <div className="dropdown">
        <div className="dropdownContainer" id="leftDropdownContainer">
          <label htmlFor="originLanguage">Source Language:</label>
          <select id="originLanguage" onChange={handleSourceLanguageChange}>
            {languages.map((language, index) => (
              <option key={index} value={language.value}>{language.label}</option>
            ))}
          </select>
        </div>

        <div className="conversionArrow">
          {/* Arrow icon button */}
          <button id="translationButton" onClick={translateCode}>
            <FontAwesomeIcon id="icon" icon={faArrowRightLong} size="7x" />
          </button>
          <p>Convert</p>
        </div>

        <div className="dropdownContainer" id="rightDropdownContainer">
          <label htmlFor="desiredLanguage">Desired Language:</label>
          <select id="desiredLanguage" onChange={handleDesiredLanguageChange}>
            {languages.map((language, index) => (
              <option key={index} value={language.value}>{language.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="codeBlocks">
      <div className="src">
          <h2 className="codeHeading">
            Enter code here:
            {/* Icon button for uploading a file */}
            <button className="uploadButton" title="Upload file">
              <FontAwesomeIcon id="icon" size="2x" icon={faFileImport} />
            </button>
          </h2>
          <textarea className="inputArea"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter code to translate"
          />
        </div>

        <div className="dest">
          <div className="outputHeading">
            <h2>Converted code:</h2>
            <div className="buttonsContainer">
              {/* Icon button for copying the output */}
              <button className="copyButton" title="Copy code" onClick={() => navigator.clipboard.writeText(translatedCode)}>
                <FontAwesomeIcon id="icon" size="2x" icon={faCopy} />
              </button>
              {/* Icon button for downloading the output */}
              <button className="downloadButton" title="Download code">
                <FontAwesomeIcon id="icon" size="2x" icon={faDownload} />
              </button>
            </div>
          </div>
          <div className="outputArea">
            <CodeOutput code={translatedCode} language={desiredLanguage} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Translate;

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import useAuth from '../useAuth';

import CodeOutput from './CodeOutput';
import History from './History';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faBroom } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faDownload, faCopy, faFileImport, faHistory } from '@fortawesome/free-solid-svg-icons'

//import 'bootstrap/dist/css/bootstrap.min.css';

const Translate = () => {

  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  /* page display based on login status */
  const navigate = useNavigate();
  const {user, isLoading} = useAuth();

  useEffect(() => {
    if ((!isLoading && !user)){
      // User is not logged in
      console.log("user is not logged in")
      navigate("/login");
    }
  }, [navigate, user, isLoading])

  const [error, setError] = useState('');
  
  const [apiReady, setApiReady] = useState(true); // API status -- manually set true/false right now for testing purposes
  const [loading, setLoading] = useState(false); // Loading state - display loading msg while api retrieves code response

  //input code and output code states
  const [inputCode, setInputCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');

  //source and destination language dropdown states
  const [sourceLanguage, setSourceLanguage] = useState('python'); 
  const [desiredLanguage, setDesiredLanguage] = useState('python');

  const handleSourceLanguageChange = (e) => {
    setSourceLanguage(e.target.value);
    console.log("Changed source language to " + sourceLanguage);
  };

  const handleDesiredLanguageChange = (e) => {
    setDesiredLanguage(e.target.value);
    console.log("Changed desired language to " + sourceLanguage);
  };

  const translateCode = () => {
    if (!inputCode.trim()) {
      setError('Input code cannot be empty');
      return;
    }

    setError(''); // Reset error message
    setTranslatedCode('');
    setLoading(true); // Set loading state to true before API call
  
    // Simulating API call with setTimeout ... replace later
    setTimeout(() => {
      setTranslatedCode(inputCode); // Dummy translation for now
      setLoading(false); // Set loading state to false after receiving response
    }, 2000); // Simulating 2 seconds delay for API response
  };
  

  //function to generate file for download
  const downloadFile = () => {
    let blob;
    let fileType;

    switch (desiredLanguage) {
      case 'python':
        blob = new Blob([translatedCode], { type: 'text/x-python-script' });
        fileType = '.py';
        break;
      case 'javascript':
        blob = new Blob([translatedCode], { type: 'text/javascript' });
        fileType = '.js';
        break;
      case 'java':
        blob = new Blob([translatedCode], { type: 'text/java' });
        fileType = '.java';
        break;
      case 'c':
        blob = new Blob([translatedCode], { type: 'text/x-csrc' });
        fileType = '.c';
        break;
      case 'csharp':
        blob = new Blob([translatedCode], { type: 'text/x-csharp' });
        fileType = '.cs';
        break;
      case 'cplusplus':
        blob = new Blob([translatedCode], { type: 'text/x-c++src' });
        fileType = '.cpp';
        break;
      case 'php':
        blob = new Blob([translatedCode], { type: 'text/x-php' });
        fileType = '.php';
        break;
      case 'go':
        blob = new Blob([translatedCode], { type: 'text/x-go' });
        fileType = '.go';
        break;
      case 'ruby':
        blob = new Blob([translatedCode], { type: 'text/x-ruby' });
        fileType = '.rb';
        break;
      case 'typescript':
        blob = new Blob([translatedCode], { type: 'text/typescript' });
        fileType = '.ts';
        break;
      default:
        blob = new Blob([translatedCode], { type: 'text/plain' }); // Default to plain text
        fileType = '.txt';
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `translated_code${fileType}`);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  };

  //array of programming languages the app will support
  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'cplusplus', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'go', label: 'Go' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  //function to handle file upload
  const fileInputRef = useRef(null); // Ref for file input element
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputCode(event.target.result);
        setTranslatedCode('');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="translateBody">

      <History showSidebar={showSidebar} toggleSidebar={toggleSidebar}/>

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
            <div className="buttonsContainer">
              {/* Icon button for toggling sidebar */}
              <button className="historyButton" title="History" onClick={toggleSidebar}>
                <FontAwesomeIcon id="icon" size="2x" icon={faHistory} />
              </button>
              {/* Icon button for uploading a file */}
              <button className="uploadButton" title="Upload file" onClick={() => fileInputRef.current.click()}>
                <FontAwesomeIcon id="icon" size="2x" icon={faFileImport} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.py,.js,.java,.c,.cs,.cpp,.php,.go,.rb,.ts" // Specify accepted file types
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              {/* Icon button for clearing text input */}
              <button className="clearButton" title="Clear text">
                <FontAwesomeIcon id="icon" size="2x" icon={faBroom} onClick={() => {setInputCode(''); setTranslatedCode('')}} />
              </button>
            </div>
          </h2>
          <textarea className="inputArea"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={error || "Enter code to translate"} // Use error message as placeholder when error exists
            style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }} // Change border color when error exists
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
              <button className="downloadButton" title="Download code" onClick={downloadFile}>
                <FontAwesomeIcon id="icon" size="2x" icon={faDownload} />
              </button>
            </div>
          </div>
          <div className="outputArea">
            {loading && <p>Loading...</p>} {/*loading text*/}
            <CodeOutput code={translatedCode} language={desiredLanguage} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Translate;

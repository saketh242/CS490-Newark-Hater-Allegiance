import React, { useEffect, useState, useRef, lazy, Suspense } from 'react'
import { auth } from '../firebase'
import { sanitizeCode } from '../utils/codeUtils'
import nhaService from '../services/nhaService'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faBroom, faCheckCircle, faTimesCircle, faCircleExclamation, faDownload, faCopy, faFileImport, faHistory } from '@fortawesome/free-solid-svg-icons'
import hljs from 'highlight.js'
import { ThreeDots } from 'react-loader-spinner'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

const Feedback = lazy( () => import('./Feedback'))
const CodeOutput = lazy( () => import('./CodeOutput'))
const History = lazy( () => import('./History'))

const Translate = () => {

  const dbUserFromRedux = useSelector((state) => state.user.dbUser)
  const user = auth.currentUser

  const [showSidebar, setShowSidebar] = useState(false)
  const toggleSidebar = () => {setShowSidebar(!showSidebar)}

  const [translationDone, setTranslationDone] = useState(false) // State variable to track translation status to display feedback

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)
  const [userTriggeredChange, setUserTriggeredChange] = useState(false)
  const [postId, setPostId] = useState("")

  const [inputCode, setInputCode] = useState('')
  const [translatedCode, setTranslatedCode] = useState('')

  const [sourceLanguage, setSourceLanguage] = useState('')
  const [desiredLanguage, setDesiredLanguage] = useState('')

  const [apiReady, setApiReady] = useState(false)
  const [loadingAPI, setLoadingAPI] = useState(true)
  const [errorAPI, setErrorAPI] = useState('')

  useEffect(() => {
    const fetchAPIStatus = async () => {
      try {
        const response = await nhaService.getOpenAIStatus()
        if (!response) throw error
        setApiReady(response)
      } catch (error) {setErrorAPI('Error fetching API status')} 
        finally {setLoadingAPI(false)}
    }
    fetchAPIStatus()
  }, [])

  useEffect(() => {setTriggerHistory(true)}, [])
  const handleSourceLanguageChange = (e) => {setSourceLanguage(e.target.value)}
  const handleDesiredLanguageChange = (e) => {setDesiredLanguage(e.target.value)}
  const [translationError, setTranslationError] = useState('')

  const translateCode = async () => {
    if (sourceLanguage === "" && desiredLanguage === "") {
      setTranslationError("Please select the source and desired languages")
      return
    } else if (sourceLanguage === "") {
      setTranslationError("Please select a source language")
      return
    } else if (desiredLanguage === "") {
      setTranslationError("Please select a desired language")
      return
    }

    if (!inputCode.trim()) {
      setError('Input code cannot be empty')
      return
    }

    setError('')
    setTranslationError('')
    setTranslatedCode('')
    setTranslationDone(false)
    setLoading(true)

    const sanitized = sanitizeCode(inputCode)
    const response = await nhaService.postPrompt(user, sourceLanguage, desiredLanguage, JSON.stringify(sanitized))

    if (!response.success) {
      setLoading(false)
      setTranslationError(response.message)
      return
    }

    const translatedCodeResponse = response.message
    setTranslatedCode(translatedCodeResponse) // Update translated code
    setLoading(false) // Set loading state to false after receiving response
    setTranslationDone(true)
    toast(`Thanks for translating! Rate this translation below!`)
    setUserTriggeredChange(true)
  }

  const [triggerHistory, setTriggerHistory] = useState(false)
  
  useEffect(() => {
    const handlePostHistory = async () => {
      try {
        if (translatedCode !== '') {
          const post = await nhaService.postHistory(user, dbUserFromRedux, inputCode, translatedCode, sourceLanguage, desiredLanguage)
          setPostId(post)
          setTriggerHistory(true)
          setUserTriggeredChange(false)
        }
      } catch (error) {
          setTranslationError("Unable to save translation to history.")
      }
    }

    if(userTriggeredChange) handlePostHistory()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTriggeredChange])

  const downloadFile = () => {
    let blob
    let fileType

    switch (desiredLanguage) {
      case 'python':
        blob = new Blob([translatedCode], { type: 'text/x-python-script' })
        fileType = '.py'
        break
      case 'javascript':
        blob = new Blob([translatedCode], { type: 'text/javascript' })
        fileType = '.js'
        break
      case 'java':
        blob = new Blob([translatedCode], { type: 'text/java' })
        fileType = '.java'
        break
      case 'c':
        blob = new Blob([translatedCode], { type: 'text/x-csrc' })
        fileType = '.c'
        break
      case 'csharp':
        blob = new Blob([translatedCode], { type: 'text/x-csharp' })
        fileType = '.cs'
        break
      case 'cplusplus':
        blob = new Blob([translatedCode], { type: 'text/x-c++src' })
        fileType = '.cpp'
        break
      case 'php':
        blob = new Blob([translatedCode], { type: 'text/x-php' })
        fileType = '.php'
        break
      case 'go':
        blob = new Blob([translatedCode], { type: 'text/x-go' })
        fileType = '.go'
        break
      case 'ruby':
        blob = new Blob([translatedCode], { type: 'text/x-ruby' })
        fileType = '.rb'
        break
      case 'typescript':
        blob = new Blob([translatedCode], { type: 'text/typescript' })
        fileType = '.ts'
        break
      default: //plain text file
        blob = new Blob([translatedCode], { type: 'text/plain' })
        fileType = '.txt'
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `translated_code${fileType}`)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
  }

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
  ]

  const fileInputRef = useRef(null)
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setInputCode(event.target.result)
        setTranslatedCode('')
      }
      reader.readAsText(file)
    }
  }

  const detectLanguage = () => {
    const textarea = document.querySelector('.inputArea')
    if (textarea) {
      const detected = hljs.highlightAuto(textarea.textContent, ["python", "javascript", "java", "c", "csharp", "cplusplus", "php", "go", "ruby", "typescript"])
      setSourceLanguage(detected.language || '')
    }
  }

  useEffect(() => {detectLanguage()}, [inputCode])

  //allow tabs on code input area
  const handleKeyPress = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = e.target
      const newValue = inputCode.substring(0, selectionStart) + '\t' + inputCode.substring(selectionEnd)
      setInputCode(newValue)
    }
  }

  return (
    <div className="translateBody">
      <Suspense>
      <History
        setTriggerHistory={setTriggerHistory}
        triggerHistory={triggerHistory}
        dbUserRedux={dbUserFromRedux}
        user={user}
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        setInputCode={setInputCode}
        setTranslatedCode={setTranslatedCode}
        setSourceLanguage={setSourceLanguage}
        setDesiredLanguage={setDesiredLanguage}
      />
      </Suspense>

      <div className="apiStatusMessage">
        <h1 className="apiStatus">
          OpenAI API Status:
          {apiReady ? (
            <FontAwesomeIcon icon={faCheckCircle} size="2x" style={{ color: 'green', marginLeft: '1rem' }} />
          ) : (
            <FontAwesomeIcon icon={faTimesCircle} size="2x" style={{ color: 'red', marginLeft: '1rem' }} />
          )}
        </h1>
        {errorAPI &&
          <div className="apiErrorMsg">
            <p>The translation service is currently unavailable. Please try again later.</p>
          </div>}
      </div>

      <div className="dropdown">
        <div className="dropdownContainer" id="leftDropdownContainer">
          <label htmlFor="originLanguage">Source Language:</label>
          <select id="originLanguage" value={sourceLanguage} onChange={handleSourceLanguageChange} data-testid='source-language-dropdown'>
            <option value="">Select</option>
            {languages.map((language, index) => (
              <option key={index} value={language.value}>{language.label}</option>
            ))}
          </select>
        </div>

        {/* CONVERSION ARROW & LOADING ANIM*/}
        <div className="conversionArrow" data-testid="Convert">
          {loading || !apiReady ? (
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#0ac6c0"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            <>
              <button
                id="translationButton"
                className="translationButton"
                onClick={translateCode}
                disabled={loading || !apiReady}
              >
                <FontAwesomeIcon id="icon" icon={faArrowRightLong} size="7x" />
              </button>
              <p>Convert</p>
            </>
          )}
        </div>

        <div className="dropdownContainer" id="rightDropdownContainer">
          <label htmlFor="desiredLanguage">Desired Language:</label>
          <select id="desiredLanguage" value={desiredLanguage} onChange={handleDesiredLanguageChange} data-testid='desired-language-dropdown'>
            <option value="">Select</option>
            {languages.map((language, index) => (
              <option key={index} value={language.value}>{language.label}</option>
            ))}
          </select>
        </div>
      </div>

      {translationError !== '' &&
        <div className="translationError" data-testid="translationErrorDiv">
          <FontAwesomeIcon icon={faCircleExclamation} id="errorIcon" size="2x" />
          <p>{translationError}</p>
        </div>}

      <div className="codeBlocks">
        <div className="src">
          <h2 className="codeHeading">
            Enter code here:
            <div className="buttonsContainer">
              {/* Icon button for toggling sidebar */}
              <button className="historyButton" title="History" onClick={toggleSidebar}>
                <FontAwesomeIcon id="icon" size="2x" icon={faHistory} fontSize={1} />
              </button>
              {/* Icon button for uploading a file */}
              <button className="uploadButton" title="Upload file" onClick={() => fileInputRef.current.click()}>
                <FontAwesomeIcon id="icon" size="2x" icon={faFileImport} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                data-testid="file-input"
                accept=".txt,.py,.js,.java,.c,.cs,.cpp,.php,.go,.rb,.ts"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              {/* Icon button for clearing text input */}
              <button className="clearButton" title="Clear text"
                onClick={() => {
                  setInputCode('')
                  setTranslatedCode('')
                }}>
                <FontAwesomeIcon id="icon" size="2x" icon={faBroom} />
              </button>

            </div>
          </h2>
          <textarea className="inputArea"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={error || "Enter code to translate"}
            style={{
              borderColor: error ? 'red' : '#0ac6c0',
              transition: 'border-color 0.3s ease',
            }} // Change border color when error exists
          />
        </div>

        <div className="dest">
          <div className="outputHeading">
            <h2>Converted code:</h2>
            <div className="buttonsContainer">
              {/* Icon button for copying the output */}
              <button className="copyButton" title="Copy code" onClick={() => {
                navigator.clipboard.writeText(translatedCode)
                toast(`Copied to clipboard!`)
              }}>
                <FontAwesomeIcon id="icon" size="2x" icon={faCopy} />
              </button>
              {/* Icon button for downloading the output */}
              <button className="downloadButton" title="Download code" onClick={downloadFile}>
                <FontAwesomeIcon id="icon" size="2x" icon={faDownload} />
              </button>
            </div>
          </div>
          <div className="outputArea">
            {loading && <p className="loadingText">Loading
              <span className="dot1">.</span>
              <span className="dot2">.</span>
              <span className="dot3">.</span>
            </p>}
            <Suspense><CodeOutput code={translatedCode} language={desiredLanguage} /></Suspense>
          </div>
        </div>
      </div>

      <div className="feedback">
        {translationDone && <Suspense><Feedback postId={postId} /></Suspense>}
      </div>
    </div>
  )
}

export default Translate

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faMagnifyingGlass, faBook, faMugHot, faCaretDown, faCaretRight, faCircleExclamation, faFileLines, faHistory } from '@fortawesome/free-solid-svg-icons'
import sample from '../images/sample.png'
import feedback from '../images/feedback.png'
import pfpImg from '../images/gravatar.png'
import historyImg from '../images/history.png'
import LatestPatch from './LatestPatch';

import nhaService from "../services/nhaService";
import { toast } from 'react-toastify';

const Help = () => {
  const [showBox, setShowBox] = useState(0);

  const [openG, setOpenG] = useState([false, false, false, false, false])
  const [openQ, setOpenQ] = useState([false, false, false, false, false])

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleContactEmail = async (e) => {
    e.preventDefault();
    setEmailError('')
    if (name === '' || email === '' || message === '') {
      setEmailError("Please fill out all fields.")
      return
    }
    else {
      try {
        const res = await nhaService.emailDev(name, email, message);
        toast(`Message sent, thank you!`)
        setName('')
        setEmail('')
        setMessage('')
        document.getElementById("contact-name").value = ""
        document.getElementById("contact-email").value = ""
        document.getElementById("contact-text").value = ""
      }
      catch (error) {
        setEmailError('Error submitting contact-us form.')
      }
    }
  }

  const handleBox = (e) => { setShowBox(e) }

  const handleGuide = (e) => {
    const update = [...openG]
    update[e] = !update[e]
    setOpenG(update)
  };

  const faqs = [
    {
      header: "Is NHA GPT free to use?",
      text: "Yes! Our online app is completely free to use! All you need is an account and you can start translating right away.",
      id: 0
    },
    {
      header: "Do you store translations?",
      text: "In order to provide you with the best support, NHA GPT stores all translations made by every user. This gives our support team more context with each feedback inquiry we receive.",
      id: 1
    },
    {
      header: "My translation came out with syntax errors, what gives?!",
      text: "Our translator is powered by OpenAI's GPT-3.5 api. If your translation came out wrong, please let us know so we can provide OpenAI with feedback to improve your experience!",
      id: 2
    },
    {
      header: "Why must I make a translation first before I can give feedback?",
      text: "We feel like it only makes sense for a user to provide feedback after using our tool rather than to provide feedback outside of using the tool.",
      id: 3
    },
    {
      header: "The translator says the API is down, what's going on?",
      text: "Because our translator is powered by OpenAI's GPT-3 api, if their system is down then so will our translator be. Unfortunately there is not much else we can do but wait.",
      id: 4
    }
  ]

  const handleOpenQ = (e) => {
    const update = [...openQ]
    update[e] = !update[e]
    setOpenQ(update)
  };

  const [searchItem, setSearchItem] = useState('')
  const [filteredFaqs, setFilteredFaqs] = useState(faqs)

  const handleInputChange = (e) => {
    const searchTerm = e.target.value
    setSearchItem(searchTerm)

    const filteredItems = faqs.filter((faq) =>
      faq.header.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredFaqs(filteredItems);
  }

  return (
    <div className='standard'>
      <h1 className="help-subtitle help-header" data-testid="help-header">How can we help?</h1>

      <div id='help-bar'>
        <div id='help-item' onClick={() => handleBox(1)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='3x' icon={faBook} /><h1 className='icon-txt' id={showBox === 1 ? 'help-active' : null}>Guides</h1></div>
        <div id='help-item' onClick={() => handleBox(2)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='3x' icon={faQuestion} /><h1 className='icon-txt' id={showBox === 2 ? 'help-active' : null}>FAQ</h1></div>
        <div id='help-item' onClick={() => handleBox(3)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='3x' icon={faMugHot} /><h1 className='icon-txt' id={showBox === 3 ? 'help-active' : null}>Contact Us</h1></div>
        <div id='help-item' onClick={() => handleBox(4)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='3x' icon={faFileLines} /><h1 className='icon-txt' id={showBox === 4 ? 'help-active' : null}>Patch Notes</h1></div>
      </div>

      <div className='help'>
        {/*Box 0*/}
        <div id='help-intro' className={showBox === 0 ? 'unhide' : 'hide'}>
          <span>Click on the <span onClick={() => handleBox(-1)}>buttons</span> above to switch between menus! :3</span>
        </div>

        {/*Box 1*/}
        <div id='help-guides' className={showBox === 1 ? 'unhide' : 'hide'}>
          <h1 className='help-header'>Have a look at these quick and detailed guides!</h1>
          {/*SIGNING UP GUIDE*/}
          <div id='guide-item' onClick={() => handleGuide(0)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={openG[0] ? faCaretDown : faCaretRight} /><span id={openG[0] ? 'help-active' : null}>How to get started</span></div>
          {openG[0] ? <div id='guide-text'>
            <div className='box' id="guide-div">
              <p id="instructionHeader" className="sectionHeader">Getting started</p>
              <ul className='instructions'>
                <li>First, go to our login page and click the sign up button</li>
                <li>Fill out the form with a valid email and sign up</li>
                <li>Shortly after, you should recieve a verification email to finish the sign up process</li>
                <li>Refresh the page and you should be let into the translator!</li>
              </ul>
              <div className='signup'>
                <img className='signup-image guide-img' src={sample} alt="signup" loading="lazy" />
              </div>
            </div>
          </div> : null}
          {/*TRANSLATING GUIDE*/}
          <div id='guide-item' onClick={() => handleGuide(1)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={openG[1] ? faCaretDown : faCaretRight} /><span id={openG[1] ? 'help-active' : null}>How to translate</span></div>
          {openG[1] ? <div id='guide-text'>
            <div className='box' id="guide-div">
              <p id="instructionHeader" className="sectionHeader">Translating</p>
              <ul className='instructions'>
                <li>Copy code into the text area or upload a file</li>
                <li>Enter the source and destination languages</li>
                <li>Click "Convert", and that's it!</li>
                <li>Download or copy the code to save it</li>
              </ul>
              <div className='signup'>

                <img className='signup-image guide-img' src={sample} alt="signup" loading="lazy"/>
              </div>
            </div>
          </div> : null}
          {/*FEEDBACK GUIDE*/}
          <div id='guide-item' onClick={() => handleGuide(2)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={openG[2] ? faCaretDown : faCaretRight} /><span id={openG[2] ? 'help-active' : null}>How to submit a feedback</span></div>
          {openG[2] ? <div id='guide-text'>
            <div className='box' id="guide-div">

              <p id="instructionHeader" className="sectionHeader">Submitting a Feedback</p>
              <ul className='instructions'>
                <li>After you make a translation, you can scroll down to submit feedback</li>
                <li>Rate the number of stars and enter your response</li>
                <li>Click submit feedback and it is saved</li>
                <li>We also store ratings</li>
              </ul>
              <div className='signup'>
                <img className='signup-image guide-img' src={feedback} alt="feedback" loading="lazy" />
              </div>
            </div>
          </div> : null}
          {/*PFP GUIDE*/}
          <div id='guide-item' onClick={() => handleGuide(3)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={openG[3] ? faCaretDown : faCaretRight} /><span id={openG[3] ? 'help-active' : null}>How to set a profile picture</span></div>
          {openG[3] ? <div id='guide-text'>
            <div className='box' id='guide-div'>
              <p id="instructionHeader" className="sectionHeader">Setting a profile picture</p>
              <ul className='instructions'>
                <li>First, start by going to <a className='link' id='guide-link' href="https://gravatar.com/" target="_blank">Gravatar</a> and creating an account with THE SAME EMAIL you used to sign up for NHAGPT</li>
                <li>Then navigate the menu to upload a new profile picture to your account</li>
                <li>Save it, and the changes should reflect momentarily on our end</li>
              </ul>
            </div>
            <div className='signup'>
              <img className='signup-image guide-img' src={pfpImg} alt="Gravatar Profile Example" loading="lazy"/>
            </div>
          </div> : null}
          {/*HISTORY GUIDE*/}
          <div id='guide-item' onClick={() => handleGuide(4)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={openG[4] ? faCaretDown : faCaretRight} /><span id={openG[4] ? 'help-active' : null}>How to see your history</span></div>
          {openG[4] ? <div id='guide-text'>
            <div className='box' id='guide-div'>
              <p id="instructionHeader" className="sectionHeader">Using the history bar</p>
              <ul className='instructions'>
                <li>While on the <Link to="/translate" className='link'>Translate</Link> page, look for this icon: <FontAwesomeIcon className='auto-icon' size="1x" icon={faHistory}/></li>
                <li>Then a new history sidebar will appear on your right</li>
                <li>Here you have 3 different dropdowns: Sort By, Filter By and Select Filter, as well as a vertical arrow to switch between ascending and descending order, and a "Clear all history" button</li>
                <li>Sort By and Filter By yield 3 options: Date (chronological order), Source Language (language you input), and Destination Language (translated output)</li>
                <li>Select Filter works in conjunction with Filter By. After you choose what to filter by, you can then select a specific filter to show only <span className='italics'>those</span> results</li>
                <li>Example: A history page sorted by date, filtered by source language, with "Java" as the filter (only shows Java inputs)</li>
              </ul>
            </div>
            <div className='signup'>
              <img className='signup-image guide-img' id='history-img' src={historyImg} alt="History Bar Example" loading="lazy"/>
            </div>
          </div> : null}
        </div> {/*END GUIDES DIV*/}


        {/*Box 2*/}
        <div id='help-faq' className={showBox === 2 ? 'unhide' : 'hide'}>
          <div id='search-bar'>
            <FontAwesomeIcon id='auto-icon' className='search-icon' size='1x' icon={faMagnifyingGlass} />
            <input id='search-input' className='default-input help-search'
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder='Type to search'
            />
          </div>
          <ul id='question-list'>
            {filteredFaqs.map(faq => <li key={faq.id}>
              <FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={openQ[faq.id] ? faCaretDown : faCaretRight}/><span data-testid='faq-item' className='help-header' id='faq-header' onClick={() => handleOpenQ(faq.id)}>{faq.header}</span>
              {openQ[faq.id] && <p>{faq.text}</p>}
            </li>)}
          </ul>
        </div>


        {/*Box 3*/}
        <div id='help-contact' className={showBox === 3 ? 'unhide' : 'hide'}>
          <div id="contact-header">
            <h1 className='help-header'>Send us a message to get additional support!</h1>
            <p>Our team will give you a response between 3-7 business days (excludes weekends and holidays)</p>
          </div>

          <div id='contact-form'>
            {emailError !== '' &&
              <div className="emailError">
                <FontAwesomeIcon icon={faCircleExclamation} id="errorIcon" size="2x" />
                <p>{emailError}</p>
              </div>}
            <div>
              <input className='default-input rainbow-border'
                id='contact-name' type='text'
                name='name'
                required
                placeholder={"Your name"}
                onChange={
                  (e) => {
                    setName(e.target.value);
                  }
                }
              />
            </div>
            <div>
              <input className='default-input rainbow-border'
                id='contact-email'
                type='email'
                placeholder='Email'
                name='email'
                required
                onChange={
                  (e) => {
                    setEmail(e.target.value)
                  }
                } />
            </div>
            <div id="textArea-div">
              <textarea className='default-textarea rainbow-border'
                id='contact-text'
                placeholder='Your message'
                name='message'
                required
                onChange={(e) => { setMessage(e.target.value) }}
              />
            </div>
            <div>
              <button className='default-button' id='contact-button' type='submit' onClick={handleContactEmail}>Send a message</button>
            </div>
          </div>
        </div>

        {/*Box 4*/}
        <div id='help-patch-notes' className={showBox === 4 ? 'unhide' : 'hide'}><LatestPatch /></div>

        {/*Box Egg*/}
        <div id='help-egg' className={showBox === -1 ? 'unhide' : 'hide'}>
          <p>
            The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues.
            The 20 meter pacer test will begin in 30 seconds. Line up at the start.
            The running speed starts slowly, but gets faster each minute after you hear this signal.
            [beep] A single lap should be completed each time you hear this sound.
            [ding] Remember to run in a straight line, and run as long as possible.
            The second time you fail to complete a lap before the sound, your test is over.
            The test will begin on the word start. On your mark, get ready, start.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Help
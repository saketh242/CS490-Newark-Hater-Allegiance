import React, { useState, Popup } from 'react'
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faMagnifyingGlass, faBook, faMugHot, faCaretDown} from '@fortawesome/free-solid-svg-icons'
import sample from '../images/sample.png'
import feedback from "../images/feedback.png"
import nhaService from "../services/nhaService";
import { toast } from 'react-toastify';

const FORM_ENDPOINT = "https://herotofu.com/start"; // TODO - update to the correct endpoint

const Help = () => {
  const [showBox, setShowBox] = useState(0);
  const [openG1, setOpenG1] = useState(false);
  const [openG2, setOpenG2] = useState(false);
  const [openG3, setOpenG3] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleContactEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await nhaService.emailDev(name, email, message);
      toast(`Message sent, thank you!`);

      // clear form after submission
      setName('');
      setEmail('');
      setMessage('');
      document.getElementById("contact-name").value = "";
      document.getElementById("contact-email").value = "";
      document.getElementById("contact-text").value = "";
    }
    catch (error){
      console.log("error posting email: ", error);
    }
  }

  const handleBox = (e) => {
    setShowBox(e);
  }

  // let guides = [false, false, false]

  const handleGuide = (e) => {
    switch(e) {
      case 1: setOpenG1(!openG1); break;
      case 2: setOpenG2(!openG2); break;
      case 3: setOpenG3(!openG3); break;
    }
  };


  const faqs = [
    {header: "Is NHA GPT free to use?",
    text: "Yes! Our online app is completely free to use! All you need is an account and you can start translating right away.",
    id: 1},
    {header: "Do you store translations?",
    text: "In order to provide you with the best support, NHA GPT stores all translations made by every user. This gives our support team more context with each feedback inquiry we receive.",
    id: 2},
    {header: "My translation came out with syntax errors, what gives?!",
    text: "Our translator is powered by OpenAI's GPT-3 api. If your translation came out wrong, please let us know so we can provide OpenAI with feedback to improve your experience!",
    id: 3},
    {header: "Why must I make a translation first before I can give feedback?",
    text: "We feel like it only makes sense for a user to provide feedback after using our tool rather than to provide feedback outside of using the tool.",
    id: 4},
    {header: "The translator says the API is down, what's going on?",
    text: "Because our translator is powered by OpenAI's GPT-3 api, if their system is down then so will our translator be. Unfortunately there is not much else we can do but wait.",
    id: 5}
  ]

  const [searchItem, setSearchItem] = useState('')
  const [filteredFaqs, setFilteredFaqs] = useState(faqs)

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)

    const filteredItems = faqs.filter((faq) =>
    faq.header.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredFaqs(filteredItems);
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   e.target.reset()
  // };

  return (
    <div className='standard'>
      {/* */}
      <h1 className="help-subtitle help-header">How can we help?</h1>

      <div id='help-bar'>
        <div id='help-item' onClick={()=>handleBox(1)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='3x' icon={faBook}/><h1 className='icon-txt' id={showBox===1 ? 'help-active': null}>Guides</h1></div>
        <div id='help-item' onClick={()=>handleBox(2)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='3x' icon={faQuestion}/><h1 className='icon-txt' id={showBox===2 ? 'help-active': null}>FAQ</h1></div>
        <div id='help-item' onClick={()=>handleBox(3)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='3x' icon={faMugHot}/><h1 className='icon-txt' id={showBox===3 ? 'help-active': null}>Contact Us</h1></div>
      </div>

      <div className='help'>
        {/*Box 0*/}
        <div className='help-intro' id={showBox===0 ? 'focus': null}>
          <span>Click on the <span onClick={()=>handleBox(4)}>buttons</span> above to change this view! :3</span>
        </div>

        {/*Box 1*/}
        <div className='help-guides' id={showBox===1 ? 'focus': null}>
          <h id='guide-title'>Have a look at these quick and detailed guides!</h>
          {/*GETTING STARTED GUIDE*/}
          <div id='guide-item' onClick={()=>handleGuide(1)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={faCaretDown}/><h id={openG1 ? 'help-active': null}>Getting Started</h></div>
          {openG1 ? <div id='guide-text'>
            <div className='box' id="getting-started-div">
              <p id="instructionHeader" className="sectionHeader">Getting Started</p>
              <ul className='instructions'>
                <li>Copy code into the text area or upload a file</li>
                <li>Enter the source and destination languages</li>
                <li>Click "Convert", and that's it!</li>
                <li>Download or copy the code to save it</li>
              </ul>
              <div className='signup'>
                <img className='signup-image' src={sample} alt="Sample Image"/>
              </div>
            </div>
          </div> : null}
          {/*TRANSLATING GUIDE*/}
          <div id='guide-item' onClick={()=>handleGuide(2)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={faCaretDown}/><h id={openG2 ? 'help-active': null}>How to submit a feedback</h></div>
          {openG2 ? <div id='guide-text'>
            <div className='box' id="getting-started-div">
              <p id="instructionHeader" className="sectionHeader">Submitting a Feedback</p>
              <ul className='instructions'>
                <li>After you make a translation, you can scroll down to submit feedback</li>
                <li>Rate the number of stars and enter your response</li>
                <li>Click submit feedback and it is saved</li>
                <li>We also store ratings</li>
              </ul>
              <div className='signup'>
                <img className='signup-image' src={feedback} alt="feedBack Image"/>
              </div>
            </div>
          </div> : null}
          {/*TRANSLATING GUIDE*/}
          <div id='guide-item' onClick={()=>handleGuide(3)}><FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={faCaretDown}/><h id={openG3 ? 'help-active': null}>How to set a profile picture</h></div>
          {openG3 ? <div id='guide-text'>
          </div> : null}
        </div>


        {/*Box 2*/}
        <div className='help-faq' id={showBox===2 ? 'focus': null}>
          <div id='search-bar'>
            <FontAwesomeIcon id='auto-icon' className='search-icon' size='1x' icon={faMagnifyingGlass}/>
            <input id='search-input' className='default-input help-search'
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder='Type to search'
            />
          </div>
          <ul id='question-list'>
            {filteredFaqs.map(faq => <li key={faq.id}>
            <h1 data-testid='faq-item' className='help-header'>{faq.header}</h1>
            <p>{faq.text}</p>
            </li>)}
          </ul>
        </div>


        {/*Box 3*/}
        <div className='help-contact' id={showBox===3 ? 'focus': null}>
          <h1 className='help-header'>Send us a message to get additional support!</h1>
          <p>Our team will give you a response between 3-7 business days (excludes weekends and holidays)</p>
          <div id='contact-form'>
            <div>
              <input className='default-input' 
              id='contact-name' type='text' 
              placeholder='Your name' 
              name='name' 
              required
              onChange={
                (e) => {
                  setName(e.target.value)
                }
              }
              />
            </div>
            <div>
              <input className='default-input' 
              id='contact-email' 
              type='email' 
              placeholder='Email' 
              name='email' 
              required
              onChange={
                (e) => {
                  setEmail(e.target.value)
                }
              }/>
            </div>
            <div>
              <textarea className='default-textarea' 
              id='contact-text' 
              placeholder='Your message' 
              name='message' 
              required
              onChange={
                (e) => {
                  setMessage(e.target.value)
                }
              }/>
            </div>
            <div>
              <button className='default-button' id='contact-button' type='submit' onClick={handleContactEmail}>Send a message</button>
            </div>
          </div>
        </div>


        {/*Box Egg*/}
        <div className='help-egg' id={showBox===4 ? 'focus': null}>
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

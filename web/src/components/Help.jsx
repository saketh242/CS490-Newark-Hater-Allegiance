import React, { useState, Popup } from 'react'
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faMagnifyingGlass, faBook, faMugHot} from '@fortawesome/free-solid-svg-icons'

const Help = () => {
  const [showBox, setShowBox] = useState(0);

  const handleBox = (e) => {
    setShowBox(e);
  }

  const faqs = [
    {header: "Is NHA GPT free to use?",
    text: "Yes! Our online app is completely free to use! All you need is an account and you can start translating right away.",
    id: 1},
    {header: "Do you store translations?",
    text: "In order to provide you with the best support, NHA GPT stores all translations made by every user. This gives our support team more context with each feedback inquiry we receive.",
    id: 2},
    {header: "My translation came out with syntax errors, what gives?!",
    text: "Our translator is powered by OpenAI's GPT-3 api. If your translation came out wrong, please let us know so we can provide OpenAI with feedback to improve your experience!",
    id: 3}
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
          <p>Click on the buttons above to change this view! :3</p>
        </div>

        {/*Box 1*/}
        <div className='help-guides' id={showBox===1 ? 'focus': null}>
          <p>Test 1</p>
        </div>


        {/*Box 2*/}
        <div className='help-faq' id={showBox===2 ? 'focus': null}>
          <div id='search-bar'>
            <FontAwesomeIcon id='auto-icon' className='search-icon' size='1x' icon={faMagnifyingGlass}/>
            <input id='search-input' className='help-search'
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder='Type to search'
            />
          </div>
          <ul id='question-list'>
            {filteredFaqs.map(faq => <li key={faq.id}>
            <h1 className='help-header'>{faq.header}</h1>
            <p>{faq.text}</p>
            </li>)}
          </ul>
        </div>

        {/*Box 3*/}
        <div className='help-contact' id={showBox===3 ? 'focus': null}>
          <h1 className='help-header'>Send us a message to get additional support!</h1>
          <p>Our team will give you a response between 3-7 business days (excludes weekends and holidays)</p>
          <p>Email: nhagpt490@gmail.com</p>
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

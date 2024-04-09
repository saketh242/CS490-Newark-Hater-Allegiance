import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faBoltLightning, faUser, faCode} from '@fortawesome/free-solid-svg-icons'
import sample from '../images/sample.png'
import Gravatar from 'react-gravatar'

import HomeReviews from './HomeReviews';

const Home = () => {
  const navigate = useNavigate()
  const handleSignup = () => {
      navigate('/signup')
  }
  return (
    <div className='standard'>
      <div className='box'>
        <h1 className="title">NHA</h1>
        <h1 className="title title2">GPT</h1>
        <p className='subtitle'>Easy code translation in seconds!</p>
      </div>


      <div className='box features'>
        <p className="sectionHeader">Key features</p>
        <div className="features-flexbox">
          <div id='perks'><FontAwesomeIcon id='auto-icon' className='home-icon' size='9x' icon={faRobot}/><h1 className='icon-txt'>Powered by GPT-3</h1></div>
          <div id='perks'><FontAwesomeIcon id='auto-icon' className='home-icon' size='9x' icon={faBoltLightning}/><h1 className='icon-txt'>Faster Code Translation</h1></div>
          <div id='perks'><FontAwesomeIcon id='auto-icon' className='home-icon' size='9x' icon={faUser}/><h1 className='icon-txt'>User Friendly Interface</h1></div>
          <div id='perks'><FontAwesomeIcon id='auto-icon' className='home-icon' size='9x' icon={faCode}/><h1 className='icon-txt'>Precision Perfected Code</h1></div>
        </div>
      </div>

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
          <br></br><button className='default-button' id='signup-button' onClick={handleSignup}>Signup today!</button>
        </div>
      </div>

      <HomeReviews />

      <div className='box' id="devCredits">
        <h2 className='rainbow'>Designed and Developed by</h2>
        <div id="devsArea">
          <div className="dev">
            <p>Saketh Puramsetti</p>
            <Gravatar email={process.env.REACT_APP_SAKETH_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Saketh'/>
          </div>
          <div className="dev">
            <p>Medina <br/>Dzhatdoyev</p>
            <Gravatar email={process.env.REACT_APP_MEDINA_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Medina'/>
          </div>
          <div className="dev">
            <p>Ausberto <br/>Colon Jr</p>
            <Gravatar email={process.env.REACT_APP_AJ_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for AJ'/>
          </div>
          <div className="dev">
            <p>John <br/>Cena</p>
            <Gravatar email={process.env.REACT_APP_JOHN_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for John'/>
          </div>
          <div className="dev">
            <p>Karam <br/>Assaf</p>
            <Gravatar email={process.env.REACT_APP_KARAM_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Karam'/>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Home

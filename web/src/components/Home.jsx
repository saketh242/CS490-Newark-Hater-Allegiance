import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faBoltLightning, faUser, faCode} from '@fortawesome/free-solid-svg-icons'
import sample from '../images/sample.png'
import Gravatar from 'react-gravatar'
import { useSelector } from 'react-redux';

import HomeReviews from './HomeReviews';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate()
  const handleHomeBtn = () => {
    if (!user) navigate('/signup');
    else navigate('/translate');
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
          <li>You will need an account in order to start using our translator</li>
          <li>After signing up, head over to the <Link to="/translate" className='link'>Translate</Link> page to begin translating!</li>
          <li>After you convert, feel free to rate your translation and leave feedback</li>
          <li>If you have any questions or concerns, please check out the <Link to="/help" className='link'>Help</Link> page!</li>
        </ul>
        <div className='signup'>
          <br/>{!user ? (<button className='default-button' id='signup-button' onClick={handleHomeBtn}>Signup today!</button>)
          : (<button className='default-button' id='signup-button' onClick={handleHomeBtn}>Translate now!</button>)}
        </div>
      </div>

      <HomeReviews />

      <div className='box' id="devCredits">
        <h2 className='rainbow'>Designed and Developed by</h2>
        <div id="devsArea">
          <div className="dev">
            <p>Saketh <br/> Puramsetti</p>
            <Gravatar email={process.env.REACT_APP_SAKETH_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Saketh'/>
            <p className="role">Project Manager</p>
          </div>
          <div className="dev">
            <p>Medina <br/>Dzhatdoyev</p>
            <Gravatar email={process.env.REACT_APP_MEDINA_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Medina'/>
            <p className="role">Frontend Lead Developer</p>
          </div>
          <div className="dev">
            <p>Ausberto <br/>Colon Jr</p>
            <Gravatar email={process.env.REACT_APP_AJ_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for AJ'/>
            <p className="role">Flex Unit</p>
          </div>
          <div className="dev">
            <p>John <br/>Cena</p>
            <Gravatar email={process.env.REACT_APP_JOHN_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for John'/>
            <p className="role">Frontend Developer</p>
          </div>
          <div className="dev">
            <p>Karam <br/>Assaf</p>
            <Gravatar email={process.env.REACT_APP_KARAM_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Karam'/>
            <p className="role">Backend Lead Developer</p>
          </div>
        </div>
        
        {/*FUNNY PLAYTESTERS DIV*/}
        <h2 className='rainbow'>Playtested by</h2>
        <div id="devsArea">
          <div className="dev">
            <p>John <br/>Cena</p>
            <Gravatar email={process.env.REACT_APP_JOHN_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for John'/>
            <p className="role">Quality Assurance</p>
          </div>
          <div className="dev">
            <p>William <br/>McCoy</p>
            <Gravatar email={process.env.REACT_APP_KOI_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for William'/>
            <p className="role">Security Analyst</p>
          </div>
        </div>
      
      </div>
    </div>
  )
}

export default Home

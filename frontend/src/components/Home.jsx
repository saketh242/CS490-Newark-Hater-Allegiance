import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faBoltLightning, faUser, faCode} from '@fortawesome/free-solid-svg-icons'
import sample from '../images/sample.png'

const Home = () => {
  const navigate = useNavigate()
  const handleSignup = () => {
      navigate('/signup')
  }
  return (
    <div className='home'>
      <div className='box'>
        <h1 className="title">NHA</h1>
        <h1 className="title title2">GPT</h1>
        <p className='subtitle'>Easy code translation in minutes!</p>
      </div>


      <div className='box features'>
        <p>Key features</p>
        <div className="features-flexbox">
          <div id='perks'><FontAwesomeIcon id='home-icon' size='10x' icon={faRobot}/><h1>Powered by GPT-3</h1></div>
          <div id='perks'><FontAwesomeIcon id='home-icon' size='10x' icon={faBoltLightning}/><h1>Faster Code Translation</h1></div>
          <div id='perks'><FontAwesomeIcon id='home-icon' size='10x' icon={faUser}/><h1>User Friendly Interface</h1></div>
          <div id='perks'><FontAwesomeIcon id='home-icon' size='10x' icon={faCode}/><h1>Precision Perfected Code</h1></div>
        </div>
      </div>

      <div className='box'>
        <p>Getting Started</p>
        <ul className='instructions'>
          <li>Copy code into the text area or upload a file</li>
          <li>Enter the source and destination languages</li>
          <li>Click "Convert", and that's it!</li>
          <li>Download or copy the code to save it</li>
        </ul>
        <div className='signup'>
          <img className='signup-image' src={sample} alt="Sample Image"/>
          <br></br><button className='signup-button' onClick={handleSignup}>Signup today!</button>
        </div>
      </div>

      <div className='box reviews'>
        <p>Some of our reviews :3</p>
        <div className="reviews-flexbox">
          <div id='review'><p>Rating ?/5<br></br>Review Text<br></br>- User Name</p></div>
          <div id='review'><p>Rating ?/5<br></br>Review Text<br></br>- User Name</p></div>
          <div id='review'><p>Rating ?/5<br></br>Review Text<br></br>- User Name</p></div>
          <div id='review'><p>Rating ?/5<br></br>Review Text<br></br>- User Name</p></div>
        </div>
      </div>

      <div className='box'>
        <p>Designed and Developed by</p>
          <p>Saketh Puramsetti</p>
          <p>John Cena</p>
          <p>Medina Dzhatdoyev</p>
          <p>Karam Assaf</p>
          <p>Ausberto Colon Jr</p>
      </div>


  
    </div>
  )
}

export default Home

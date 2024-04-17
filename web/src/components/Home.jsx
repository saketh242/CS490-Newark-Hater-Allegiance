import { React, lazy, Suspense} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faBoltLightning, faUser, faCode} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'

const HomeReviews = lazy( () => import('./HomeReviews'))
const Developers = lazy( () => import('./Developers'))
const LatestPatch = lazy( () => import('../patchNotes/LatestPatch'))

const Home = () => {
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate()
  const handleHomeBtn = () => {
    if (!user) navigate('/signup')
    else navigate('/translate')
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

      <Suspense><HomeReviews /></Suspense>
      <div className='box' id='patch-notes'><Suspense><LatestPatch /></Suspense></div>
      <Suspense><Developers /></Suspense>
    </div>
  )
}

export default Home

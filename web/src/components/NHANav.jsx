import { Link, useNavigate } from 'react-router-dom'
import { signOut } from "firebase/auth"
import { toast } from 'react-toastify'
import { auth } from '../firebase'
import { FaUserCircle } from "react-icons/fa"
import { useSelector } from 'react-redux'
import Gravatar from 'react-gravatar'

function NHANav() {
  const user = useSelector((state) => state.user.user)
  const dbUser = useSelector((state) => state.user.dbUser)

  const navigate = useNavigate()
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/")
      navigate("/login")
      toast(`Logged out successfully`)
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <>
      <nav className="nha-navbar">
        <Link className="nav-brand nav-a" to="/">NHAGPT</Link>
        <div className="links-flexbox">      
          <Link className="nav-a nav-rl" to="/help">Help</Link>
          <Link className="nav-a nav-rl" to="/translate">Translate</Link>
          <div className="dropdown-nav">
            <Link className='nav-a nav-rl '>
              {user ? (<Gravatar className='nav-icon' id="navPic" default="mp" email={user.email} />) : (<FaUserCircle className='nav-icon' />)}
            </Link>
            <div className="dropdown-content">
              {!user ? (
                <>
                <Link className='nav-a nav-rl' to="/login">Login</Link>
                <Link className='nav-a nav-rl' to="/signup">Signup</Link>
                </>
              ) : (
                <>
                  <Link className='nav-a nav-rl' to="/viewProfile">Hi {dbUser&& dbUser.firstName} (👉ﾟヮﾟ)👉</Link>
                  <Link className='nav-a nav-rl' to="/settings">Settings</Link>
                  <Link onClick={handleLogout} className='nav-a nav-rl'>Logout</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <p className="bottom-nav-bar"></p>
    </>
  )
}

export default NHANav
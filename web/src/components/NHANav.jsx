import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import useAuth from '../useAuth';
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';




function NHANav() {

  const userName = useSelector((state) => state.user.name);


  const navigate = useNavigate()
  const { user, isLoading, name, setName } = useAuth()

  // function to handle logout 
  const handleLogout = () => {
    signOut(auth).then(() => {
      //setName(null);
      navigate("/");
      console.log("Signed out successfully")
      navigate("/login")
      const msg = () => toast(`Logged out successfully`);
      msg();
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <>

      <nav className="nha-navbar">
        <Link className="nav-brand nav-a" to="/">
          NHAGPT
        </Link>
        <div className="links-flexbox">      
          <Link className="nav-a nav-rl" to="/help">
            Help

          </Link>
          <Link className="nav-a nav-rl" to="/translate">
            Translate
          </Link>
          <div className="dropdown-nav">
            <Link className='nav-a nav-rl '>
              <FaUserCircle className='nav-icon' />
            </Link>
            <div className="dropdown-content">
              {!user ? (
                <>
                <Link className='nav-a nav-rl' to="/login">Login</Link>
                <Link className='nav-a nav-rl' to="/signup">Signup</Link>
                </>
              ) : (
                <>
                  <Link className='nav-a nav-rl' to="/viewProfile">Hi {userName? userName:name} (👉ﾟヮﾟ)👉</Link>
                  <Link onClick={handleLogout} className='nav-a nav-rl'>Logout</Link>
                  <Link className='nav-a nav-rl' to="/settings">Settings</Link>
                </>
              )}

            </div>
          </div>

          {/* {user ? <Link onClick={handleLogout} className="nav-a nav-rl">Logout</Link> : <Link className="nav-a nav-rl" to="/login">Login</Link>} */}

        </div>
      </nav>
      <p className="bottom-nav-bar"></p>
    </>
  );
}

export default NHANav;

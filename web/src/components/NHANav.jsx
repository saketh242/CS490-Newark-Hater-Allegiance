import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import useAuth from '../useAuth';
import { FaUserCircle } from "react-icons/fa";



function NHANav() {

  const navigate = useNavigate()
  const { user, isLoading } = useAuth()


  // function to handle logout 
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
      console.log("Signed out successfully")
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

          <Link className="nav-a nav-rl" to="/docs">
            Docs
          </Link>
          <Link className="nav-a nav-rl" to="/translate">
            Translate
          </Link>
          <div className="dropdown-nav">
            <Link className='nav-a nav-rl '><FaUserCircle className='nav-icon' /></Link>
            <div className="dropdown-content">
              {!user ? (
                <>
                <Link className='nav-a nav-rl' to="/login">Login</Link>
                <Link className='nav-a nav-rl' to="/signup">Signup</Link>
                </>
              ) : (
                <>
                  <Link onClick={handleLogout} className='nav-a nav-rl' to="/logout">Logout</Link>
                  <Link className='nav-a nav-rl' to="/changePassword">Change Password</Link>
                  <Link className='nav-a nav-rl' to="/deleteAccount">Delete Account</Link>
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
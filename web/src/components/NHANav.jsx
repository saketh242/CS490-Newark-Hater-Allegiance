import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';

import Gravatar from 'react-gravatar'


function NHANav() {

  const user = useSelector((state) => state.user.user);
  const dbUser = useSelector((state) => state.user.dbUser);
  const isLoading = useSelector((state) => state.user.isLoading);



  const navigate = useNavigate()

  // function to handle logout 
  const handleLogout = () => {
    signOut(auth).then(() => {
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
              {user ? (
                <Gravatar className='nav-icon' id="navPic" default="mp" email={user.email} />
              ) : (
                <FaUserCircle className='nav-icon' />
              )}
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

          {/* {user ? <Link onClick={handleLogout} className="nav-a nav-rl">Logout</Link> : <Link className="nav-a nav-rl" to="/login">Login</Link>} */}

        </div>
      </nav>
      <p className="bottom-nav-bar"></p>
    </>
  );
}

export default NHANav;

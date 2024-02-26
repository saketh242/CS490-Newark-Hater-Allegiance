import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';

function NHANav() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoggedIn(true)
          // User is logged in
          const uid = user.uid;
          console.log("uid", uid)
        } else {
          // User is logged out
          console.log("user is logged out")
          setIsLoggedIn(false)
        }
      });
     
  },[])

  // function to handle logout 
  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false)
          navigate("/login");
          console.log("Signed out successfully")
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
          {!isLoggedIn && <Link className="nav-a nav-rl" to="/login">
            Login
          </Link>}
          {isLoggedIn && <Link onClick={handleLogout} className="nav-a nav-rl">
            Logout
          </Link>}
          
        </div>
      </nav>
      <p className="bottom-nav-bar"></p>
    </>
  );
}

export default NHANav;
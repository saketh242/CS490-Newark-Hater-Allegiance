import React from 'react';
import { Link } from 'react-router-dom';

function NHANav() {
  
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
          <Link className="nav-a nav-rl" to="/login">
            Login
          </Link>
        </div>
      </nav>
      <p className="bottom-nav-bar"></p>
    </>
  );
}

export default NHANav;

import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from "../firebase";
import { toast } from 'react-toastify';

import { isValidEmail, isValidPassword } from '../utils/fieldValidations';

import nhaService from '../services/nhaService';

const Login = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }

  const handleForgot = () => {
    navigate("/forgotPassword")
  }

  const handleLogin = async (e) => {

    e.preventDefault();

    if (email === '' || password == "") {
      setError("Please fill all the fields");
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email!");
      return
    }

    else if (email == "" || password == "") {
      setError("Email and password required!");
      return
    }

    try {
      // setting persistence here
      if (!isChecked) {
        await setPersistence(auth, browserSessionPersistence);
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = userCredential.user.getIdToken();
      //const userDetails = await nhaService.getUser(user);
      // this line is calling it again lol
      console.log(`Welcome ${user.displayName}`);
      const msg = () => toast(`Welcome ${user.displayName}`);
      msg();
      navigate("/");

    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid Credentials");
      } else {
        setError("Login failed. Please check your email and password.");
      }
    }

  }
  return (
    <div className='login-content'>

      <div className="loginTop">
        <h2 className="login-heading">NHAGPT</h2>
        {/* <p className="loginHeaderText">Login</p> */}
      </div>
      <form className='login-form'>
        <div className="login-box">
          <input
            className='email-input'
            type="email"
            value={email}
            onChange={
              (e) => {
                setEmail(e.target.value)
                setError(null)
              }
            }
            placeholder="Email"
            autoComplete='off'
            required
            style={{
              borderColor: error ? 'red' : '#0ac6c0',
              transition: 'border-color 0.3s ease',
            }}
          />
          <input
            className='password-login'
            type="password"
            value={password}
            onChange={
              (e) => {
                setPassword(e.target.value)
                setError(null);
              }

            }
            placeholder="Password"
            autoComplete='off'
            required
            style={{
              borderColor: error ? 'red' : '#0ac6c0',
              transition: 'border-color 0.3s ease',
            }}
          />
          <div className='login-flex-box'>
            <p className='check-box-p'>Remember Me? <input
              type="checkbox"
              id="myCheckbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            /></p>
            <p className='check-box-p forgot-password' onClick={handleForgot}>Forgot Password?</p>
          </div>

          <button type="submit" className='login-btn' onClick={handleLogin}>Login</button>
          <div className='signup-msg'>
            <p>No Account?</p>
            <Link to="/signup">
              Signup
            </Link>
          </div>
          {error && <p className='error-msg'>{error}</p>}
        </div>
      </form>

    </div>
  )
}

export default Login

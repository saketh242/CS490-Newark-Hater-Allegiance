import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import nhaService from '../services/nhaService';

const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        nhaService.postUser("Andy", "McWilson", email, user.uid)
        console.log(user)
        navigate("/")
      }).catch((err) => {

        const errCode = err.code
        const errMessage = err.message
        console.log(errCode, errMessage)

      })

  }
  return (
    <div className='login-content'>
     <h2 className="login-heading">NHAGPT</h2>
     <form className='login-form'>
     <div className="login-box">
     <input
          className='email-input'
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input 
        className='password-login'
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        />
        <button type="submit" className='login-btn' onClick={handleLogin}>Login</button>
        <div className='signup-msg'>
          <p>No Account?</p>
          <Link to="/signup">
            Signup
          </Link>
        </div>
     </div>
     </form>
    </div>
  )
}

export default Login

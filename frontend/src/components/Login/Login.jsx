import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {  signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import useAuth from '../../useAuth';
import {  toast } from 'react-toastify';


import { isValidEmail, isValidPassword } from '../../utils/fieldValidations';

import nhaService from '../../services/nhaService';

const Login = () => {
  

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { user, isLoading } = useAuth();

  const handleLogin = (e) => {

    e.preventDefault();

    if(email === "" || password==""){
      setError("Email and password required!");
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email!");
      return
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        const userDetails = await nhaService.getUser(user);

        // userDetails should contain the first name and last name
        const { firstName, lastName } = userDetails;

        console.log(`Welcome ${firstName} ${lastName}`);
        const msg = () => toast(`Welcome ${firstName} ${lastName}`);
        msg();
        
        navigate("/");
    }).catch((err) => {
        if (err.code === "auth/invalid-credential") {
            setError("Invalid Credentials");
        } else {
            setError("Login failed. Please check your email and password.");
        }
    });


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
          autoComplete='off'
          required
          style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }}
        />
        <input 
        className='password-login'
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete='off'
        required
        style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }}
        />
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

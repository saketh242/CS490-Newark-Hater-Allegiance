import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { isValidEmail, isValidPassword } from "../utils/fieldValidations";
import { auth } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import useAuth from "../useAuth";
import nhaService from '../services/nhaService';

const Signup = () => {

    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [error, setError] = useState(null)

    const handleSignup = async (e) => {

        e.preventDefault();

        if (firstName==="" || lastName==="" || email==="" || password === "" || password2===""){
          setError("All fields are required!")
          return
        }

        if (!isValidEmail(email)){
          setError("Please enter a valid email!")
          return
        }

        if (password != password2){
          setError("Passwords are different!")
          return
        }

        if (!isValidPassword(password)){
          setError("Password should be 8 characters long, one lowercase, one uppercase, one digit")
          return
        }

       
        await createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            nhaService.postUser(firstName, lastName, email, idToken)
            console.log(idToken);
            const msg = () => toast(`Welcome ${firstName} ${lastName}`);
            msg()
            navigate("/")

          })
          .catch((err) => {
            if (err.message === "Firebase: Error (auth/email-already-in-use)."){
              setError("Email address already registered!")
            }
            console.log(err.message)

          })

    }



  return (
    <div className='signup-content'>
      <form className="signup-form">
     <h2 className="login-heading">NHAGPT</h2>
     
     <div className="signup-box">
        <div className="name-inputs">
            <input
                className="name-input-box"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }}
            />
            <input
                className="name-input-box"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }}
            />
        </div>
     <input
          className='signup-email-input'
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }}
        />
        <input 
        className='signup-password-input'
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }}
        />
        <input 
        className='signup-password-input'
        type="password" 
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        placeholder="Retype Password"
        style={{ borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease', }}
        />
        <button type="submit" className='login-btn' onClick={handleSignup}>Signup</button>
        <div className='signup-msg'>
          <p>Already have an account?</p>
          <Link to="/login">
            Login
          </Link>
        </div>
        
     </div>
    
     </form>
     {error && <p className="error-msg">{error}</p>}
    </div>
  )
}

export default Signup

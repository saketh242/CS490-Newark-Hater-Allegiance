import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence, sendEmailVerification, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { isValidEmail, isValidPassword, isValidName } from "../utils/fieldValidations";
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import nhaService from '../services/nhaService';

const Signup = () => {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState(null)
  const [isChecked, setIsChecked] = useState(false);


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }

  const handleSignup = async (event) => {
    event.preventDefault();

    if (firstName === "" || lastName === "" || email === "" || password === "" || password2 === "") {
      setError("All fields are required!")
      return
    }

    else if (!isValidName(firstName) || !isValidName(lastName)) {
      setError("Please enter a valid name")
      return
    }

    else if (!isValidEmail(email)) {
      setError("Please enter a valid email!")
      return
    }

    else if (password != password2) {
      setError("Passwords are different!")
      return
    }

    else if (!isValidPassword(password)) {
      setError("Password should be 8 characters long, one lowercase, one uppercase, one digit")
      return
    }

    try {
     
      // creating the user with backend 
      const response = await nhaService.postUser(firstName, lastName, email, password);
      if (response.message == "User information received successfully"){
        console.log("Hello Saketh");
      }
      await signInWithEmailAndPassword(auth, email, password);
      // Send verification email to the new email address
      await sendEmailVerification(auth.currentUser);
      console.log("Verification email sent");
       // setting persistence here
       if (!isChecked) {
        await setPersistence(auth, browserSessionPersistence);
      }      
      const msg = () => toast(`Welcome ${firstName} ${lastName}, verify email to continue!`);
      msg();  

    } catch (e) {
      if (e.message == "User already exists"){
        setError("Email address already registered!")
        return
      }
      
    }
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
              onChange={(e) => {
                setFirstName(e.target.value)
                setError(null)
              }}
              placeholder="First Name"
              style={{
                borderColor: error ? 'red' : '#0ac6c0',
                transition: 'border-color 0.3s ease',
              }}
            />
            <input
              className="name-input-box"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                setError(null)
              }}
              placeholder="Last Name"
              style={{
                borderColor: error ? 'red' : '#0ac6c0',
                transition: 'border-color 0.3s ease',
              }}
            />
          </div>
          <input
            className='signup-email-input'
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            placeholder="Email"
            style={{
              borderColor: error ? 'red' : '#0ac6c0',
              transition: 'border-color 0.3s ease',
            }}
          />
          <input
            className='signup-password-input'
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null)
            }}
            placeholder="Password"
            style={{
              borderColor: error ? 'red' : '#0ac6c0',
              transition: 'border-color 0.3s ease',
            }}
          />
          <input
            className='signup-password-input'
            type="password"
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value)
              setError(null)
            }}
            placeholder="Retype Password"
            style={{
              borderColor: error ? 'red' : '#0ac6c0',
              transition: 'border-color 0.3s ease',
            }}
          />
          <p className='check-box-p'>Remember Me? <input
            type="checkbox"
            id="myCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          /></p>
          <button className='login-btn' onClick={handleSignup}>Signup</button>
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

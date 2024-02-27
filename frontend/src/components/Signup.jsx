import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';
import nhaService from '../services/nhaService';

const Signup = () => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const handleSignup = async (e) => {

        e.preventDefault();

        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            nhaService.postUser(firstName, lastName, email, userCredential.user.uid) //Registers user to mongodb
            const user = userCredential.user;
            console.log(user)
            navigate("/login")

          })
          .catch((err) => {
            const errCode = err.code
            const errMessage = err.message
            console.log(errCode, errMessage)

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
            />
            <input
                className="name-input-box"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
            />
        </div>
     <input
          className='signup-email-input'
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input 
        className='signup-password-input'
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        />
        <input 
        className='signup-password-input'
        type="password" 
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        placeholder="Retype Password"
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
    </div>
  )
}

export default Signup

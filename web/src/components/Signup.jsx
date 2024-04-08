import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence, sendEmailVerification, updateProfile } from 'firebase/auth';
import { isValidEmail, isValidPassword, isValidName } from "../utils/fieldValidations";
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import useAuth from "../useAuth";
import nhaService from '../services/nhaService';
import { useDispatch } from 'react-redux';
import { setUser, setDbUser } from '../features/user/userSlice';

const Signup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState(null)
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // If user is already logged in, navigate to the home page
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }

  const handleSignup = async (e) => {

    e.preventDefault();

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
      // setting persistence here
      if (!isChecked) {
        await setPersistence(auth, browserSessionPersistence);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      })
      // Send verification email to the new email address
      await sendEmailVerification(auth.currentUser);
      console.log("Verification email sent");
      const user = userCredential.user;
      setUser(user);
      const idToken = await user.getIdToken();
      await nhaService.postUser(firstName, lastName, email, idToken)
      dispatch(setDbUser({ firstName, lastName }));
      const msg = () => toast(`Welcome ${firstName} ${lastName}, verify email to continue!`);
      msg()
    } catch (e) {
      if (e.message === "Firebase: Error (auth/email-already-in-use).") {
        setError("Email address already registered!")
        return
      }
      console.log(e.message)
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

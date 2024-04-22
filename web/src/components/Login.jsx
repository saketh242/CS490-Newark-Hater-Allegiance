import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier
} from 'firebase/auth'
import { auth } from "../firebase"
import { toast } from 'react-toastify'

import { isValidEmail } from '../utils/fieldValidations'
import { isValidSixDigitCode } from '../utils/fieldValidations'

import VerificationInput from "react-verification-input"

const Login = () => {
  const recaptchaVerifierRef = useRef(null);
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier('recaptcha-container-id', {
        'size': 'invisible',
        'callback': () => console.log('reCAPTCHA solved!'),
        'expired-callback': function () {
          console.log('reCAPTCHA token expired')
          recaptchaVerifierRef.current.render().then(function (widgetId) {
            window.recaptchaWidgetId = widgetId
          })
        },
        'timeout': 60000
      }, auth)

      recaptchaVerifierRef.current.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId
      }).catch(function (error) { })
    }
    return () => { }
  }, [])

  const [verificationCode, setVerificationCode] = useState("")
  const [mfaCase, setMfaCase] = useState(false)
  const [verificationId, setVerificationId] = useState(null)
  const [resolver, setResolver] = useState(null)

  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => { setIsChecked(!isChecked) }
  const handleForgot = () => { navigate("/forgotPassword") }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill all the fields")
      return
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email!")
      return
    }

    try {
      if (!isChecked) {
        await setPersistence(auth, browserSessionPersistence)
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err) { handleAuthErrors(err) }
  }

  const handleAuthErrors = async (err) => {
    switch (err.code) {
      case "auth/invalid-login-credentials":
        setError("Invalid Credentials")
        break;
      case "auth/multi-factor-auth-required":
        handleMultiFactorAuth(err)
        break
      default:
        setError("Login failed. Try again")
    }
  };

  const handle2FALogin = async () => {
    if (verificationCode === "") {
      setError("Enter verification code!")
      return
    }

    if (!isValidSixDigitCode(verificationCode)) {
      setError("Enter a valid code!")
      return
    }
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode)
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred)
      await resolver.resolveSignIn(multiFactorAssertion)
      const user = auth.currentUser
      toast(`Welcome ${user.displayName}`)
      navigate("/")
    } catch (e) {
      if (window.recaptchaVerifier) setTimeout(() => recaptchaVerifierRef.current.reset(), 500)

      if (e.code === "auth/invalid-verification-code") {
        setError("Invalid Code! Try entering it again.")
      } else if (e.code === "auth/code-expired") {
        setError("Code Expired. Please request a new code or reload the page.")
      } else {
        setError("Error validating code! Try Again!");
      }
    }
  }

  const handleMultiFactorAuth = async (err) => {
    const resolverVar = getMultiFactorResolver(auth, err)
    // removing the if check because sms is the only 2fa we have right now
    const phoneAuthProvider = new PhoneAuthProvider(auth)
    try {
      const verificationIdVar = await phoneAuthProvider.verifyPhoneNumber({
        multiFactorHint: resolverVar.hints[0],
        session: resolverVar.session
      }, recaptchaVerifierRef.current)
      setResolver(resolverVar)
      setVerificationId(verificationIdVar)
      setMfaCase(true)
    } catch (error) { setError("Failed to complete multi-factor authentication.") }
  }

  return (
    <div className='login-content'>
      <div id="recaptcha-container-id"></div>
      {!mfaCase ?
        (
          <>
            <div className="loginTop">
              <h2 className="login-heading">NHAGPT</h2>
            </div>
            <form className='login-form'>
              <div className="login-box">
                <input
                  className='email-input'
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="Email"
                  autoComplete='off'
                  style={{ borderColor: error ? 'red' : '#0ac6c0', transition: 'border-color 0.3s ease' }}
                />
                <input
                  className='password-login'
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Password"
                  autoComplete='off'
                  style={{ borderColor: error ? 'red' : '#0ac6c0', transition: 'border-color 0.3s ease' }}
                />
                <div className='login-flex-box'>
                  <p className='check-box-p'>Remember Me? <input type="checkbox" id="myCheckbox" checked={isChecked} onChange={handleCheckboxChange} /></p>
                  <p className='check-box-p forgot-password' onClick={handleForgot}>Forgot Password?</p>
                </div>
                <button type="submit" className='login-btn' onClick={handleLogin}>Login</button>
                <div className='signup-msg'>
                  <p>No Account?</p>
                  <Link to="/signup">Signup</Link>
                </div>
                {error && <p className='error-msg'>{error}</p>}
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="popupContent" id="loginVerify">
              <div id="verificationHeader">
                <h1 id="tfa-header">Two-Factor authentication</h1>
                <p>Enter the code that was sent to your phone number.</p>
              </div>
              <VerificationInput validChars='0-9' onChange={(code) => setVerificationCode(code)}
                classNames={{
                  container: "otp-container",
                  character: "character",
                  characterInactive: "character--inactive",
                  characterSelected: "character--selected",
                  characterFilled: "character--filled",
                }} />
              <button className="default-button login-btn" onClick={handle2FALogin}>Submit Code</button>
            </div>
            {error && <p className='error-msg' id="verifyError">{error}</p>}
          </>
        )}
    </div>
  )
}

export default Login
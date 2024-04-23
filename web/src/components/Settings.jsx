import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faPenToSquare, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { auth } from "../firebase"
import { toast } from 'react-toastify'
import {
  multiFactor,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  verifyBeforeUpdateEmail,
  PhoneAuthProvider,
  RecaptchaVerifier,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
} from "firebase/auth"

import nhaService from '../services/nhaService'
import { useDispatch } from 'react-redux'
import { setDbUser } from '../features/user/userSlice'
import { useSelector } from 'react-redux'
import { isValidEmail, isValidName, isValidSixDigitCode } from '../utils/fieldValidations'
import VerificationInput from 'react-verification-input'

const Settings = () => {

  const recaptchaVerifierRef = useRef(null)

  const user = useSelector((state) => state.user.user)
  const dbUser = useSelector((state) => state.user.dbUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [mfaCase, setMfaCase] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationId, setVerificationId] = useState(null)
  const [resolver, setResolver] = useState(null)

  const [firstName, setFirstName] = useState(dbUser ? dbUser.firstName : "")
  const [lastName, setLastName] = useState(dbUser ? dbUser.lastName : "")
  const [email, setEmail] = useState(user ? user.email : "")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(dbUser || {})  // this is a placeholder for knowing the current state of data

  const firebaseUser = auth.currentUser
  const enrolledFactors = multiFactor(firebaseUser).enrolledFactors
  let has2FA
  if (enrolledFactors) has2FA = enrolledFactors.length > 0

  // const [receivedData, setReceivedData] = useState(false);
  // const [triggerEffect, setTriggerEffect] = useState(true);

  const handleChangePassword = () => { navigate("/changePassword") }
  const handleDeleteAccount = () => { navigate("/deleteAccount") }
  const handle2FA = () => { navigate("/enable2FA") }

  const handleChangeEmail = async (e) => {
    e.preventDefault()

    if (email === "") {
      setError("Email cannot be empty (¬_¬ )")
      return
    }

    if (password === "") {
      setError("Enter password to update profile");
      return
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email!")
      return
    }

    const emailCheck = email === user.email ? false : true
    if (!emailCheck) {
      setError("Edit email to update!")
      return
    }

    // now reauthenticating the user and changing email :)
    try {
      const firebaseUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(firebaseUser, credential)

      // reauthentication done now changing emails
      try {
        await nhaService.updateUser(firebaseUser, email, firstName, lastName, true, false, false)
        await verifyBeforeUpdateEmail(firebaseUser, email)
        await signOut(auth)
        navigate("/login")
        const msg = () => toast(`Email change initiated, check your inbox and profile updated :)`)
        msg()
      } catch (err) {
        setError("An error occured when changing the email, try again")
        return
      }
    } catch (e) { handleAuthErrors(e) }
  }

  const handleAuthErrors = async (err) => {
    switch (err.code) {
      case "auth/invalid-login-credentials":
        setError("Incorrect Password")
        break
      case "auth/multi-factor-auth-required":
        handleMultiFactorAuth(err)
        break
      default:
        setError("Reauthentication failed. Try again")
    }
  }

  const handleMultiFactorAuth = async (err) => {

    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier('recaptcha-container-id', {
        'size': 'invisible',
        'callback': () => console.log('reCAPTCHA solved!'),
        'expired-callback': function () {
          recaptchaVerifierRef.current.render().then(function (widgetId) {
            window.recaptchaWidgetId = widgetId
          });
        },
        'timeout': 60000
      }, auth)

      recaptchaVerifierRef.current.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId
      }).catch(function (error) { })
    } catch (e) {
      setError("Recaptcha Error, try again or reload page")
      return
    }

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

    } catch (error) {
      setError("Failed to complete multi-factor authentication.")
    }
  }

  const handleChangeName = async (e) => {
    e.preventDefault()
    try {
      if (firstName === "" || lastName === "") {
        setError("Fields cannot be empty (¬_¬ )")
        return
      }

      if (!isValidName(firstName) || !isValidName(lastName)) {
        setError("Enter a valid name!")
        return
      }

      const fNameCheck = firstName === userData.firstName ? false : true
      const lNameCheck = lastName === userData.lastName ? false : true

      if (!fNameCheck && !lNameCheck) {
        setError("Edit name to update!")
        return
      }

      // updating name in redux
      const obj = { firstName: firstName, lastName: lastName, email: email, _id: dbUser._id }
      dispatch(setDbUser(obj))
      setUserData(obj)

      await nhaService.updateUser(firebaseUser, email, firstName, lastName, false, true, true)
      const msg = () => toast(`Name updated :)`)
      msg()
    } catch (e) {
      setError("Error updating name, try again :(")
      return
    }
  }

  const handle2FALogin = async () => {

    if (verificationCode == "") {
      setError("Enter verification code!");
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
      // now we can change the email
      try {
        await nhaService.updateUser(firebaseUser, email, firstName, lastName, true, false, false)
        await verifyBeforeUpdateEmail(firebaseUser, email)
        await signOut(auth)
        navigate("/login")
        const msg = () => toast(`Email change initiated, check your inbox and profile updated :)`)
        msg()
      } catch (err) {
        setError("An error occured when changing the email, try again")
        return
      }

    } catch (e) {
      if (window.recaptchaVerifier) setTimeout(() => recaptchaVerifierRef.current.reset(), 500)

      if (e.code === "auth/invalid-verification-code") {
        setError("Invalid Code! Try entering it again.")
      } else if (e.code === "auth/code-expired") {
        setError("Code Expired. Please request a new code or reload the page.")
      } else {
        setError("Error validating code! Try Again!")
      }
    }
  }

  return (
    <div className='settings-div' style={mfaCase ? { alignItems: 'center' } : {}}>
      <div id="recaptcha-container-id"></div>
      <div className='settings-head-div' style={mfaCase ? { paddingBottom: "2rem" } : {}}>
        <FontAwesomeIcon size='4x' icon={faGear} className='settings-icon' />
        <p className='settings-head-p'>Settings</p>
      </div>
      {
        !mfaCase ?
          (
            <>
              <form className='settings-form'>
                <div className='name-changes-div'>
                  <p className='edit-profile'>Change Name:</p>
                  <input
                    className="settings-email-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      setError(null)
                    }}
                    placeholder="First Name"
                    data-testid="firstNameInput"
                    style={{
                      borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease',
                    }}
                  />
                  <input
                    className="settings-email-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value)
                      setError(null)
                    }}
                    placeholder="Last Name"
                    data-testid="lastNameInput"
                    style={{
                      borderColor: error ? 'red' : '#0ac6c0',
                      transition: 'border-color 0.3s ease',
                    }}
                  />

                  <div className='button-div-settings'>
                    <button className='login-btn' onClick={handleChangeName}>Update Name</button>
                  </div>
                </div>

                {user && (
                  <div>
                    <p className='edit-profile'>Change Email:</p>
                    <input
                      className='settings-email-input'
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
                      data-testid="password-id-settings"
                      className='settings-email-input'
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError(null)
                      }}
                      placeholder='Enter password before updating email'
                      style={{
                        borderColor: error ? 'red' : '#0ac6c0',
                        transition: 'border-color 0.3s ease',
                      }}
                    />
                    <div className='button-div-settings'>
                      <button type="submit" data-testid="update-btn" className='login-btn' onClick={handleChangeEmail}>Update Email</button>
                    </div>
                  </div>)}
              </form >

              <div className="options-div">
                <div className='option-div hover-div' onClick={handleChangePassword}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <p>Change Password</p>
                </div>
                <div className='option-div hover-div' onClick={handleDeleteAccount}>
                  <FontAwesomeIcon icon={faTrash} />
                  <p data-testid="deleteAccount">Delete Account</p>
                </div>
                {user.emailVerified &&
                  <div className='option-div hover-div' onClick={handle2FA}>
                    <FontAwesomeIcon icon={faShieldHalved} />
                    <p>{has2FA ? "Disable" : "Enable"} 2FA</p>
                  </div>}
              </div>
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
            </>
          )
      }
      {error && <p className='error-msg error-settings'>{error}</p>}
    </div >
  )
}

export default Settings
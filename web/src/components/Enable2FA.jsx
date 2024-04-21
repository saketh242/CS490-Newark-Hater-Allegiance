import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom'

import {
  multiFactor,
  RecaptchaVerifier,
  PhoneAuthProvider,
  reauthenticateWithCredential,
  EmailAuthProvider,
  PhoneMultiFactorGenerator,
  getMultiFactorResolver,
  signOut
} from "firebase/auth"

import { auth } from "../firebase"
import nhaService from "../services/nhaService"
import { toast } from 'react-toastify'
import { isValidPhoneNumber, isValidSixDigitCode } from "../utils/fieldValidations"
import VerificationInput from "react-verification-input"

const Enable2FA = () => {
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null);
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier('recaptcha-container-id', {
        'size': 'invisible',
        'callback': (response) => console.log('reCAPTCHA solved!', response),
        'expired-callback': function() {
          console.log('reCAPTCHA token expired')
          recaptchaVerifierRef.current.render().then(function(widgetId) {
            window.recaptchaWidgetId = widgetId
          })
        },
        'timeout': 60000 
      }, auth)
      
      recaptchaVerifierRef.current.render().then(function(widgetId) {
        window.recaptchaWidgetId = widgetId
      }).catch(function(error) {
        console.error('Error rendering reCAPTCHA:', error)
      })
    }
    return () => {}
  }, [])

  const [verificationCode, setVerificationCode] = useState("")
  const [verificationId, setVerificationId] = useState(null)
  const [resolver, setResolver] = useState(null)
  const [mfaCase, setMfaCase] = useState(false)

  const [phoneNumber, setPhoneNumber] = useState("")
  const [code, setCode] = useState("")
  // const [recaptchaSolved, setRecaptchaSolved] = useState(false);
  const [error, setError] = useState(null)
  const [password, setPassword] = useState("")
  const [codeSent, setCodeSent] = useState(false)

  const user = auth.currentUser
  const enrolledFactors = multiFactor(user).enrolledFactors
  let has2FA
  if (enrolledFactors) has2FA = enrolledFactors.length > 0

  const handleVerifyCode = async () => {
    if (!isValidSixDigitCode(code)) {
      setError("Enter a valid code!")
      return
    }
    try {
      const cred = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred)
      await multiFactor(user).enroll(multiFactorAssertion, "PhoneNumber")

      // if success; signout user
      signOut(auth).then(() => {
        navigate("/login")
        const msg = () => toast(`2FA enabled, login again :)`);
        msg();
      }).catch((error) => { })

    } catch (e) {
      if (e.code == 'auth/invalid-verification-code') {
        setError("Incorrect code! (¬_¬ )")
        return
      } else {
        setError('Error verifying code!')
        return
      }
    }
  }

  const handleAuthErrors = async (err) => {
    switch (err.code) {
      case "auth/invalid-login-credentials":
        setError("Incorrect Password, try again!")
        break
      case "auth/multi-factor-auth-required":
        handleMultiFactorAuth(err)
        break
      default:
        setError("Reauthentication failed. Try again")
    }
  }

  const handleMultiFactorAuth = async (err) => {
    const resolverVar = getMultiFactorResolver(auth, err);
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

  const handle2FALogin = async () => {
    if (verificationCode == "") {
      setError("Enter verification code!")
      return
    }

    if (!isValidSixDigitCode(verificationCode)) {
      setError("Enter a valid code!")
      return
    }
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await resolver.resolveSignIn(multiFactorAssertion);

      // now try to unenroll the user
      const firebaseUser = auth.currentUser;
      const enrolledFactors = multiFactor(user).enrolledFactors
      if (has2FA) {
        const multiFactorUser = multiFactor(auth.currentUser);
        return multiFactorUser.unenroll(enrolledFactors[0])
          .then(() => {
            signOut(auth).then(() => {
              const msg = () => toast(`2FA Disabled :), Login again`);
              msg()
              navigate("/login");
            }).catch((error) => {
              setError("Error signing out, try again!")
              return
            })
          }).catch(() => {
            setError("Error disabling 2FA, try again :(")
            return
          })
      }

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

  const handle2FA = async () => {
    if (password == "" || phoneNumber == "") {
      setError("Please enter password and phone number")
      return
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Invalid phone number, (+19876543210)")
      return
    }
    // reauthenticating the user
    try {
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)

      // now handling the 2fa
      // generating the multifactorSession
      const multiFactorSession = await multiFactor(user).getSession()
      const phoneInfoOptions = {
        phoneNumber: phoneNumber,
        session: multiFactorSession
      }

      const phoneAuthProvider = new PhoneAuthProvider(auth)
      const verificationIDVar = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifierRef.current)
      setVerificationId(verificationIDVar)
      setCodeSent(true)
    } catch (e) {
      setError("Error in handle2FA")
      return
    }
  }

  const handleDisable2FA = async (e) => {
    e.preventDefault()

    if (password == "") {
      setError("Enter password!")
      return
    }
    // reauthenticating the user
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential)
    } catch (e) {
      // this will throw an error everytime because, en user has mfa and is trying to reauthenticate
      handleAuthErrors(e)
    }
  }

  const handleChangePhoneNumber = async () => {
    // chnage phone number logic here
    if (phoneNumber == "") {
      setError("Enter a phone number!");
      return
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Enter a valid phone number");
      return
    }
  }

  return (
    <div className="div-2fa">
      <div id="recaptcha-container-id"></div>
      {
        has2FA ?
          <div>
            <h2 className="h2-2fa">2Factor Authentication was already enabled on your account</h2>
            <div className="buttons-2fa">
              {!mfaCase ?
                (
                  <>
                    <div className="content-2fa">
                      <p className="p-2fa">We recommend using 2FA, enter password and click the button to disable it</p>
                      <input
                        type="password"
                        className='password-change'
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError(null)
                        }}
                        placeholder='Password'
                        autoComplete='off'
                        required
                        style={{
                          borderColor: error ? 'red' : '#0ac6c0',
                          transition: 'border-color 0.3s ease',
                        }}
                      />

                      <button onClick={handleDisable2FA} className="login-btn disable-2fa-btn">Disable 2FA</button>
                      {error && <p className="error-msg">{error}</p>}
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
                )}
            </div>
            {error && <p className="error-msg" style={{ textAlign: "center" }}>{error}</p>}
          </div>
          :
          <div className="enable-2fa-user">
            <h2 className="h2-2fa">Enable 2FA for extra security</h2>
            {!codeSent ?
              <>
                <input
                  data-testid="password-id"
                  className='password-input-2fa'
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(null)
                  }}
                  placeholder="Enter password before enabling 2FA"
                  style={{
                    borderColor: error ? 'red' : '#0ac6c0',
                    transition: 'border-color 0.3s ease',
                  }}
                />
                <input
                  data-testid="phoneNumber-id"
                  className='phoneNumber-input'
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    setError(null)
                  }}
                  placeholder="+1987654321 (Enter phone number)"
                  style={{
                    borderColor: error ? 'red' : '#0ac6c0',
                    transition: 'border-color 0.3s ease',
                  }}
                />
                <button className="login-btn" onClick={handle2FA}>Send Code</button>
              </> :
              <>
                <div className="popupContent" id="loginVerify">
                  <div id="verificationHeader">
                    <h1 id="tfa-header">Two-Factor authentication</h1>
                    <p>Enter the code that was sent to your phone number.</p>
                  </div>
                  <VerificationInput validChars='0-9' onChange={(code) => setCode(code)}
                    classNames={{
                      container: "otp-container",
                      character: "character",
                      characterInactive: "character--inactive",
                      characterSelected: "character--selected",
                      characterFilled: "character--filled",
                    }} />
                  <button className="default-button login-btn" onClick={handleVerifyCode}>Submit Code</button>
                </div>
              </>}
            {error && <p className="error-msg">{error}</p>}
          </div>
      }
    </div>
  )
}

export default Enable2FA
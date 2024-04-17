import { useState, useEffect, useRef } from "react";
import { multiFactor, RecaptchaVerifier, PhoneAuthProvider, reauthenticateWithCredential, EmailAuthProvider, PhoneMultiFactorGenerator } from "firebase/auth";
import { auth } from "../firebase";

const Enable2FA = () => {

  const recaptchaVerifierRef = useRef(null);
  useEffect(() => {
    // Initialize the RecaptchaVerifier instance
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier('container-recaptcha', {
        'size': 'invisible'
      }, auth);
      recaptchaVerifierRef.current.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId;
      });
    }
  }, []);

  const [verificationId, setVerificationId] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [code, setCode] = useState("");
  const [recaptchaSolved, setRecaptchaSolved] = useState(false)
  const [error, setError] = useState(null)
  const [password, setPassword] = useState("")
  const user = auth.currentUser
  const enrolledFactors = multiFactor(user).enrolledFactors

  let has2FA;
  if (enrolledFactors) {
    has2FA = enrolledFactors.length > 0;
  }

  //toast(`Email change initiated, check your inbox and profile updated :)`)

  const handleVerifyCode = async () => {
    try {
      const cred = PhoneAuthProvider.credential(verificationId, code)
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred)
      multiFactor(user).enroll(multiFactorAssertion, "PhoneNumber")
    } catch (e) {
      setError('Error in handleVerifyCode')
      console.log(e)
    }
  }

  const handle2FA = async () => {
    // reauthenticating the user
    try {
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)
      console.log("re authentication successful")

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

    } catch (e) {
      setError("Error in handle2FA")
      console.log(e);
      return
    }
  }

  return (
    <div className="div-2fa">
      <div id="container-recaptcha"></div>
      {
        has2FA ?
          <div><h2 className="h2-2fa">2Factor Authentication was already enabled on your account</h2></div>
          :
          <div className="enable-2fa-user">
            <h2 className="h2-2fa">Enable 2FA for extra security</h2>
            <input
              data-testid="password-id"
              className='signup-password-input'
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
              placeholder="+123 456 789"
              style={{
                borderColor: error ? 'red' : '#0ac6c0',
                transition: 'border-color 0.3s ease',
              }}
            />

            <button className="login-btn" onClick={handle2FA}>Send Code</button>

            <input
              data-testid="code-id"
              className='code-input'
              type="text"
              pattern="\+\d{3}-\d{3}-\d{4}"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError(null)
              }}
              placeholder="code"
              style={{
                borderColor: error ? 'red' : '#0ac6c0',
                transition: 'border-color 0.3s ease',
              }}
            />

            <button className="login-btn" onClick={handleVerifyCode}>Verify Code</button>
          </div>
      }
    </div>
  )
}

export default Enable2FA

import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { multiFactor, RecaptchaVerifier, PhoneAuthProvider, reauthenticateWithCredential, EmailAuthProvider, PhoneMultiFactorGenerator, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faUserPen } from '@fortawesome/free-solid-svg-icons'
import nhaService from "../services/nhaService";
import { toast } from 'react-toastify';
import { isValidPhoneNumber, isValidSixDigitCode } from "../utils/fieldValidations";

const Enable2FA = () => {
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null);
  useEffect(() => {

    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier('container-recaptcha', {
        'size': 'invisible'
      }, auth);
      recaptchaVerifierRef.current.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId;
      });
    }
  }, []);

  const [verificationId, setVerificationId] = useState(null);

  const [deletePage, setDeletePage] = useState(null);
  const [editPage, setEditPage] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [recaptchaSolved, setRecaptchaSolved] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const user = auth.currentUser

  const enrolledFactors = multiFactor(user).enrolledFactors
  let has2FA;
  if (enrolledFactors) {
    has2FA = enrolledFactors.length > 0;
  }
  //  const msg = () => toast(`Email change initiated, check your inbox and profile updated :)`);
  //  msg()

  const handleVerifyCode = async () => {
    if (!isValidSixDigitCode(code)) {
      setError("Enter a valid code!");
      return
    }
    try {
      const cred = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(user).enroll(multiFactorAssertion, "PhoneNumber");

      // if success
      // signout user
      signOut(auth).then(() => {
        navigate("/login")
        const msg = () => toast(`2FA enabled login again :)`);
        msg();
      }).catch((error) => {
        console.log(error)
      });

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

  const handle2FA = async () => {

    if (password == "" || phoneNumber == "") {
      setError("Please enter password and phone number");
      return
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Invalid phone number, (+19876543210)");
      return
    }
    // reauthenticating the user
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential)
      console.log("re authentication successful");

      // now handling the 2fa

      // generating the multifactorSession
      const multiFactorSession = await multiFactor(user).getSession();
      const phoneInfoOptions = {
        phoneNumber: phoneNumber,
        session: multiFactorSession
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationIDVar = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifierRef.current)
      setVerificationId(verificationIDVar)
      setCodeSent(true);
    } catch (e) {
      setError("Error in handle2FA");
      console.log(e);
      return;
    }

  }

  const handleDisable2FA = async () => {

    try {
      const firebaseUser = auth.currentUser;
      console.log(firebaseUser)

      const result = await nhaService.disable2FA(firebaseUser);
      console.log(result)

      if (result.status) {
        // 2fa disabled successfully
        const msg = () => toast(`2FA disabled :)`);
        msg()
        // now logout
        signOut(auth).then(() => {
          console.log("Signed out successfully")
          navigate("/login")
        }).catch((error) => {
          console.log(error)
        });
      } else {
        throw new Error(result.error || 'Failed to disable 2FA');
      }

    } catch (e) {
      setError(e.message || 'An error occurred disabling 2FA, try again');
      return
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
      <div id="container-recaptcha"></div>
      {
        has2FA ?
          <div>
            <h2 className="h2-2fa">2Factor Authentication was already enabled on your account</h2>
            <div className="buttons-2fa">

                <div className="content-2fa">
                <p className="p-2fa">We recommend using 2FA, click the button below to disable it</p>

                  <button onClick={handleDisable2FA} className="login-btn disable-2fa-btn">Disable 2FA</button>
                  {error && <p className="error-msg">{error}</p>}
                </div>
             
            </div>



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

                <input
                  data-testid="code-id"
                  className='code-input'
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError(null)
                  }}
                  style={{
                    borderColor: error ? 'red' : '#0ac6c0',
                    transition: 'border-color 0.3s ease',
                  }}
                />

                <button className="login-btn" onClick={handleVerifyCode}>Verify Code</button>

              </>}

            {error && <p className="error-msg">{error}</p>}

          </div>
      }
    </div>
  )
}

export default Enable2FA

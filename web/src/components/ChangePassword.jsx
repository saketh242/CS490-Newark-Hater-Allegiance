import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { isValidPassword, isValidSixDigitCode } from '../utils/fieldValidations'

import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    PhoneAuthProvider,
    RecaptchaVerifier,
    getMultiFactorResolver,
    PhoneMultiFactorGenerator,
    signOut
} from 'firebase/auth'

import { auth } from '../firebase'
import { toast } from 'react-toastify'
import VerificationInput from 'react-verification-input'

const ChangePassword = () => {

    const recaptchaVerifierRef = useRef(null)
    const navigate = useNavigate()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    const [error, setError] = useState(null)

    //const [needs2FA, setNeeds2FA] = useState(false)
    const [mfaCase, setMfaCase] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [verificationId, setVerificationId] = useState(null)
    const [resolver, setResolver] = useState(null)

    const user = auth.currentUser

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (currentPassword === "" || newPassword === "" || newPassword2 === "") {
            setError("Fields cannot be empty")
            return
        }

        else if (!isValidPassword(currentPassword)) {
            setError("Enter a valid current password")
            return
        }

        else if (!isValidPassword(newPassword) || !isValidPassword(newPassword2)) {
            setError("Password should be 8 characters long, one lowercase, one uppercase, one digit")
            return
        }

        else if (currentPassword === newPassword) {
            setError("New password cannot be the old password!")
            return
        }

        else if (newPassword !== newPassword2) {
            setError("Both passwords has to be the same")
            return
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(user, credential)

            try {
                await updatePassword(user, newPassword)

                signOut(auth).then(() => {
                    const msg = () => toast(`Password changed successfully, login again`)
                    msg()
                    navigate("/login")
                }).catch((error) => { })
            } catch (e) {
                setError("Error changing password, try again!")
                return
            }
        } catch (e) {handleAuthErrors(e)}
    }

    const handleAuthErrors = async (err) => {
        switch (err.code) {
            case "auth/invalid-login-credentials":
                setError("Incorrect Password, try again!")
                break
            case "auth/multi-factor-auth-required":
                //setNeeds2FA(true)
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
              'expired-callback': function() {
                recaptchaVerifierRef.current.render().then(function(widgetId) {
                  window.recaptchaWidgetId = widgetId
                })
              },
              'timeout': 60000 
            }, auth)
            
            recaptchaVerifierRef.current.render().then(function(widgetId) {
              window.recaptchaWidgetId = widgetId
            }).catch(function(error) {})
          } catch(e){
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

        } catch (error) { setError("Failed to complete multi-factor authentication.") }
    }

    const handle2FALogin = async () => {
        if (verificationCode === ""){
            setError("Enter verification code!")
            return
        }

        if (!isValidSixDigitCode(verificationCode)){
            setError("Enter a valid code!")
            return
        }

        try {
            const cred = PhoneAuthProvider.credential(verificationId, verificationCode)
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred)
            await resolver.resolveSignIn(multiFactorAssertion)
            // now we can change the password
            try {
                await updatePassword(user, newPassword)

                signOut(auth).then(() => {
                    const msg = () => toast(`Password changed successfully, login again`)
                    msg()
                    navigate("/login")
                }).catch((error) => {})
            } catch (e) {
                setError("Error changing password, try again!")
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
        <div className='change-password-div'>
            <p className='change-password-heading'>Change Password</p>
            <div id="recaptcha-container-id"></div>
            {
                !mfaCase ?
                    (<>
                        <form className='change-password-form'>
                            <input
                                type="password"
                                className='password-change'
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value)
                                    setError(null)
                                }}
                                placeholder='Current Password'
                                autoComplete='off'
                                required
                                style={{
                                    borderColor: error ? 'red' : '#0ac6c0',
                                    transition: 'border-color 0.3s ease',
                                }}
                            />
                            <input
                                type="password"
                                className='password-change'
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value)
                                    setError(null)
                                }}
                                placeholder='New Password'
                                autoComplete='off'
                                required
                                style={{
                                    borderColor: error ? 'red' : '#0ac6c0',
                                    transition: 'border-color 0.3s ease',
                                }}
                            />
                            <input
                                type="password"
                                className='password-change'
                                value={newPassword2}
                                onChange={(e) => {
                                    setNewPassword2(e.target.value)
                                    setError(null)
                                }}
                                placeholder='Retype New Password'
                                autoComplete='off'
                                required
                                style={{
                                    borderColor: error ? 'red' : '#0ac6c0',
                                    transition: 'border-color 0.3s ease',
                                }}
                            />

                            <button type="submit" className='login-btn' onClick={handleChangePassword}>Update Password</button>
                        </form>
                    </>) : (
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
            {error && <p className='error-msg'>{error}</p>}
        </div>
    )
}

export default ChangePassword
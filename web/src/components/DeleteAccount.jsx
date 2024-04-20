import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    signOut,
    deleteUser,
    PhoneAuthProvider,
    RecaptchaVerifier,
    getMultiFactorResolver,
    PhoneMultiFactorGenerator,
} from 'firebase/auth'

import { auth } from '../firebase'
import { toast } from 'react-toastify'
import nhaService from '../services/nhaService'
import VerificationInput from 'react-verification-input'

const DeleteAccount = () => {
    const recaptchaVerifierRef = useRef(null)
    useEffect(() => {
        // Initialize the RecaptchaVerifier instance
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier('recaptcha-container-id', {
                'size': 'invisible',
                'expired-callback': function () {
                    recaptchaVerifierRef.current.reset()
                }
            }, auth)
            recaptchaVerifierRef.current.render().then(function (widgetId) {
                window.recaptchaWidgetId = widgetId
            })
        }
    }, [])

    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [verificationCode, setVerificationCode] = useState("");

    const [mfaCase, setMfaCase] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [resolver, setResolver] = useState(null);

    const user = auth.currentUser;
    const navigate = useNavigate()
    const [deleted, setDeleted] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault()
        if (password === "") {
            setError("Please enter your password")
            return
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, password)
            await reauthenticateWithCredential(user, credential)
            try {
                await nhaService.deleteUser(user) //delete user from db
                await deleteUser(user) //delete user from firebase
                await signOut(auth);
                navigate("/login")
                const msg = () => toast(`Account deleted successfully!`)
                msg()
            } catch (e) {
                setError("Error deleting account, try again")
                return
            }
        } catch (err) {handleAuthErrors(err)}
    }

    const handle2FALogin = async () => {
        try {
            const cred = PhoneAuthProvider.credential(verificationId, verificationCode)
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred)
            await resolver.resolveSignIn(multiFactorAssertion)
            // now we can delete the account
            await nhaService.deleteUser(user)
            await deleteUser(user);
            await signOut(auth);
            navigate("/login")
            const msg = () => toast(`Account deleted successfully!`)
            msg()

        } catch (e) {
            if (window.recaptchaVerifier) window.recaptchaVerifier.reset()

            if (e.code === "auth/invalid-verification-code") {
                setError("Invalid Code! Try entering it again.")
            } else if (e.code === "auth/code-expired") {
                setError("Code Expired. Please request a new code or reload the page.")
            } else { setError("Error validating code! Try Again!") }
            setError("Error during 2FA, please contact us for help.")
        }
    }

    const handleAuthErrors = async (err) => {
        switch (err.code) {
            case "auth/invalid-login-credentials":
                setError("Invalid Credentials")
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

        } catch (error) { setError("Failed to complete multi-factor authentication.") }
    }

    return (
        <div className="delete-account-div">
            <h2 className="delete-heading warning-flash">Deleted accounts cannot be recovered again!</h2>
            <div id="recaptcha-container-id"></div>

            {!mfaCase ?
                (<>
                    <form className="delete-form">
                        <input
                            data-testid="password-id"
                            type="password"
                            className='password-change'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError(null)
                            }}
                            placeholder='Enter password'
                            autoComplete='off'
                            required
                            style={{
                                borderColor: error ? 'red' : '#0ac6c0',
                                transition: 'border-color 0.3s ease',
                            }}
                        />

                        <button
                            disabled={deleted}
                            type="submit"
                            onClick={handleDelete}
                            className="login-btn"
                            id='delete-acc-btn'
                        >Delete Account</button>
                    </form>
                </>) : (
                    <>
                        <div className="popupContent" id="loginVerify">
                            <div id="verificationHeader">
                                <h1 id="tfa-header">Two-Factor authentication</h1>
                                <p>Must authenticate to delete account.</p>
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
            {error && <p className="error-msg">{error}</p>}
        </div>
    )
}

export default DeleteAccount
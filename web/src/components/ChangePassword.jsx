import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { isValidPassword } from '../utils/fieldValidations'

import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    deleteUser,
    PhoneAuthProvider,
    RecaptchaVerifier,
    getMultiFactorResolver,
    PhoneMultiFactorGenerator,
    signOut
} from 'firebase/auth';

import { auth } from '../firebase';
import { toast } from 'react-toastify';
import VerificationInput from 'react-verification-input';

const ChangePassword = () => {

    const recaptchaVerifierRef = useRef(null);
    useEffect(() => {
        // Initialize the RecaptchaVerifier instance
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier('recaptcha-container-id', {
                'size': 'invisible',
                callback: (response) => console.log('captcha solved!', response),
                'expired-callback': function () {
                    recaptchaVerifierRef.current.reset();
                }
            }, auth);
            recaptchaVerifierRef.current.render().then(function (widgetId) {
                window.recaptchaWidgetId = widgetId;
            });
        }
    }, []);

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [error, setError] = useState(null);

    const [mfaCase, setMfaCase] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [resolver, setResolver] = useState(null);

    const user = auth.currentUser;

    const handleChangePassword = async (e) => {

        e.preventDefault();

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

        else if (currentPassword == newPassword) {
            setError("New password cannot be the old password!")
            return
        }

        else if (newPassword != newPassword2) {
            setError("Both passwords has to be the same")
            return
        }


        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential)
            console.log("re authentication successful")

            try {
                await updatePassword(user, newPassword);
                console.log("Password Chnaged");

                signOut(auth).then(() => {
                    const msg = () => toast(`Password changed successfully, login again`);
                    msg()
                    navigate("/login");
                    console.log("Passsword changed and redirected successfully")
                }).catch((error) => {
                    console.log(error)
                });
            } catch (e) {
                console.log("Error changing password, try again");
                setError("Error changing password, try again!");
                return
            }

        } catch (e) {
            console.log(e);
            handleAuthErrors(e)
        }

    }

    const handleAuthErrors = async (err) => {
        switch (err.code) {
            case "auth/invalid-login-credentials":
                setError("Invalid Credentials");
                break;
            case "auth/multi-factor-auth-required":
                handleMultiFactorAuth(err);
                break;
            default:
                setError("Reauthentication failed. Try again");
        }
    }

    const handleMultiFactorAuth = async (err) => {
        const resolverVar = getMultiFactorResolver(auth, err);
        // removing the if check because sms is the only 2fa we have right now
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        try {
            const verificationIdVar = await phoneAuthProvider.verifyPhoneNumber({
                multiFactorHint: resolverVar.hints[0],
                session: resolverVar.session
            }, recaptchaVerifierRef.current);
            setResolver(resolverVar);
            setVerificationId(verificationIdVar);
            setMfaCase(true);

        } catch (error) {
            console.error("2FA error:", error);
            setError("Failed to complete multi-factor authentication.");
        }

    };

    const handle2FALogin = async () => {
        try {
            const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
            await resolver.resolveSignIn(multiFactorAssertion);
            // now we can change the password
            try {
                await updatePassword(user, newPassword);
                console.log("Password Chnaged");

                signOut(auth).then(() => {
                    const msg = () => toast(`Password changed successfully, login again`);
                    msg()
                    navigate("/login");
                    console.log("Passsword changed and redirected successfully")
                }).catch((error) => {
                    console.log(error)
                });
            } catch (e) {
                console.log("Error changing password, try again");
                setError("Error changing password, try again!");
                return
            }


        } catch (e) {
            if (window.recaptchaVerifier) window.recaptchaVerifier.reset();

            if (e.code === "auth/invalid-verification-code") {
                setError("Invalid Code! Try entering it again.");
            } else if (e.code === "auth/code-expired") {
                setError("Code Expired. Please request a new code or reload the page.");

            } else {
                setError("Error validating code! Try Again!");
            }
            console.error("Error during 2FA:", e);
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
                                    setError(null);
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
                            {/* <h2 className='heading-2fa-login'>Enter verification Code</h2>
                            <input
                                className='email-input'
                                type="text"
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value);
                                    setError(null);
                                }}
                                placeholder="123456"
                                autoComplete='off'
                                style={{ borderColor: error ? 'red' : '#0ac6c0', transition: 'border-color 0.3s ease' }}
                            />
                            <button className="login-btn" onClick={handle2FALogin}>Submit Code</button> */}
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

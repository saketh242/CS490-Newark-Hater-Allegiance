import React, { useState } from "react"
import { isValidEmail } from "../utils/fieldValidations"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const auth = getAuth()
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const handleSendReset = () => {
        if (email === "") {
            setError("Enter email! ヽ（≧□≦）ノ")
            return
        }

        if (!isValidEmail(email)) {
            setError("Enter a valid email!")
            return
        }

        sendPasswordResetEmail(auth, email)
            .then((res) => {
                toast.success('Reset email sent :)')
                console.log(res)
            })
            .catch((error) => {
                setError(error.message)
            })
    };

    return (
        <div className="forgot-div">
            <h3 className="forgot-head">Forgot password?</h3>
            <input
                data-testid="email-id"
                type="text"
                placeholder="Enter email"
                value={email}
                className="forgot-input"
                onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                }}
                style={{
                    borderColor: error ? 'red' : '#0ac6c0',
                    transition: 'border-color 0.3s ease',
                }}
            />
            <button className="login-btn" onClick={handleSendReset}>Send password reset email</button>
            {error && <p className="error-msg">{error}</p>}
        </div>
    )
}

export default ForgotPassword

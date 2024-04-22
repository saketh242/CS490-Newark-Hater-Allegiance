import { auth } from "../firebase"
import { sendEmailVerification } from "firebase/auth"
import { toast } from 'react-toastify'

const VerificationMessage = () => {
  const handleSendVerification = async () => {
    await sendEmailVerification(auth.currentUser)
    toast(`Verification email sent`)
  }

  return (
    <div className="verify-flex">
      <h1 className="verify-email-head">Verify email to continue!</h1>
      {/* <button className="login-btn" onClick={handleSendVerification}>Send Verification</button> */}
    </div>
  )
}

export default VerificationMessage

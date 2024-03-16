import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { toast } from 'react-toastify';


const VerificationMessage = () => {

  const user = auth.currentUser;

  const handleSendVerification = async () => {
    await sendEmailVerification(auth.currentUser);
    const msg = () => toast(`Verification email sent`);
    msg()
  }

  return (
    <div className="verify-flex">
      <h1 className="verify-email-head">Verify email to continue!</h1>
      {/* <button className="login-btn" onClick={handleSendVerification}>Send Verification</button> */}
    </div>
  )
}

export default VerificationMessage

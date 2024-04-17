import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidPassword } from '../utils/fieldValidations'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { toast } from 'react-toastify'

const ChangePassword = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [error, setError] = useState(null);
    const user = auth.currentUser;

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (currentPassword === "" || newPassword === "" || newPassword2 === ""){
            setError("Fields cannot be empty")
            return 
        }
        else if (!isValidPassword(currentPassword)){
            setError("Enter a valid current password")
            return
        }
        else if (!isValidPassword(newPassword) || !isValidPassword(newPassword2)){
            setError("Password should be 8 characters long, one lowercase, one uppercase, one digit")
            return
        }
        else if (currentPassword == newPassword){
            setError("New password cannot be the old password!")
            return
        }
        else if (newPassword != newPassword2){
            setError("Both passwords have to be the same")
            return
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential)
            await updatePassword(user, newPassword);
            
            signOut(auth).then(() => {
                toast(`Password changed successfully, login again`)
                navigate("/login");
            }).catch((error) => {
              setError('Error updating password.')
            });
            
        } catch(e) {
            if (e.message == "Firebase: Error (auth/invalid-credential)."){
                setError("Wrong password, try again :(")
                return
            } else {
                setError("An error occured try again")
                return
            }
        }
    }

    return (
        <div className='change-password-div'>
            <form className='change-password-form'>
                <p className='change-password-heading'>Change Password</p>
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
            {error && <p className='error-msg'>{error}</p>}
        </div>
    )
}

export default ChangePassword

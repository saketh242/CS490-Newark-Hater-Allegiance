import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { isValidPassword } from '../utils/fieldValidations'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import useAuth from '../useAuth';
const ChangePassword = () => {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [error, setError] = useState(null);
    const {user, isLoading} = useAuth()

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
            setError("Enter a valid new password")
            return
        }

        else if (currentPassword == newPassword){
            setError("New password cannot be the old password!")
            return
        }


        try {
            // all field validations pass now time to reauthenticate user and change password :)
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential)
            // user authenticated successfully, now chnaging password
            console.log("re authentication successful")

            // changing password
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
            
    

        } catch(e) {
            console.log(e.message)
            if (e.message == "Firebase: Error (auth/invalid-credential)."){
                setError("Wrong password, try again :(")
            } else {
                setError("An error occured try again")
            }
        }
        

            



        
    }

    return (
        <div className='change-password-div'>
            
            <form className='change-password-form'>
                <p className='chnage-password-heading'>Change Password</p>
                <input
                    type="password"
                    className='password-change'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    onChange={(e) => setNewPassword2(e.target.value)}
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
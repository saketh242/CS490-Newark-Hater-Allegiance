import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { isValidPassword } from '../utils/fieldValidations'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import useAuth from '../useAuth';

const DeleteAccount = () => {

    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const {user, isLoading} = useAuth()

    const handleDelete = async (e) => {
        e.preventDefault()
        if (password == ""){
            setError("Please enter your password");
            return
        }

        try {
            // all field validations pass now time to reauthenticate user and delete account :(
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential)
            console.log("re authentication successful")
        } catch((e) => {
            console.log(e)
        }) 
 
s

    }

    return (
        <div className="delete-account-div">

            <h2 className="delete-heading">Deleted accounts cannot be recovered again!</h2>
            <form className="delete-form">
                <input
                    type="password"
                    className='password-change'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter password'
                    autoComplete='off'
                    required
                    style={{
                        borderColor: error ? 'red' : '#0ac6c0',
                        transition: 'border-color 0.3s ease',
                    }}
                />

                <button type="submit" onClick={handleDelete} className="login-btn">Delete Account</button>
            </form>
            {error && <p className="error-msg">{error}</p>}
        </div>
    )
}

export default DeleteAccount

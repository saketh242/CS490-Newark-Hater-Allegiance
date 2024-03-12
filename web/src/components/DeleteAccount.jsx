import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { isValidPassword } from '../utils/fieldValidations'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import useAuth from '../useAuth';
import spongecry from "../memeGifs/crysponge.gif"

const DeleteAccount = () => {

    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const [deleted, setDeleted] = useState(false);
   
    const handleDelete = async (e) => {
        e.preventDefault()
        if (password == "") {
            setError("Please enter your password");
            return
        }

        try {
            
            // all field validations pass now time to reauthenticate user and delete account :(
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential)
            console.log("re authentication successful")
            // now deleting the user
            setDeleted(true);
            setTimeout(async () => {
                await deleteUser(user);
                console.log("User deleted!")
                signOut(auth).then(() => {
                    const msg = () => toast(`Account deleted successfully!`);
                    msg()
                    navigate("/");
                    console.log("Account deleted and redirected successfully and redirected successfully")
                }).catch((error) => {
                    console.log(error)
                });
            }, 3000)

        } catch (e) {
            console.log(e.message)
            if (e.message == "Firebase: Error (auth/invalid-credential).") {
                setError("Wrong password, try again :(")
            } else {
                setError("An error occured try again")
            }
        }
    }
    return (
        
        <div className="delete-account-div">
            
            {!deleted && (
                <>
            
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

                <button
                disabled={deleted}
                 type="submit"
                  onClick={handleDelete} 
                  className="login-btn"
                  >Delete Account</button>
            </form>
            {error && <p className="error-msg">{error}</p>}
            
        </>
            )}
            {deleted &&  (
                <>
                    <p className='bye-message'>Sorry to see you go :(</p>
                </>

            )}
        <img style={{display: deleted?'block':'none'}} className='meme2' src={spongecry} alt="spongebob crying"></img>

        </div>
    )
}

export default DeleteAccount

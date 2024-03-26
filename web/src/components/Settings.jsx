import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../useAuth';
import { auth } from "../firebase";
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, signOut, updateEmail, verifyBeforeUpdateEmail } from "firebase/auth";
import { isValidEmail } from '../utils/fieldValidations';
import nhaService from '../services/nhaService';


const Settings = () => {

  const navigate = useNavigate();

  // getting currenlty signed in user
  const user = auth.currentUser;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [receivedData, setReceivedData] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(true);

  useEffect(() => {
    nhaService.getUser(user)
      .then((data) => {
        setUserData(data)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setReceivedData(true);
      }).catch((e) => {
        console.log(e)
      })
  }, [triggerEffect, user])

  const handleChangePassword = () => {
    navigate("/changePassword");
    return
  }

  const handleDeleteAccount = () => {
    navigate("/deleteAccount");
    return
  }

  const handleUpdateprofile = async (e) => {
    e.preventDefault()
    if (firstName == "" && lastName == "" && email == "") {
      setError("You need to fill atleast one field!");
      return
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email!");
      return
    }

    if (password === "") {
      setError("Please enter your password before updating");
      return
    }
    const emailCheck = email === user.email ? false : true
    const fNameCheck = firstName === userData.firstName ? false : true
    const lNameCheck = lastName === userData.lastName ? false : true

    if (!emailCheck && !fNameCheck && !lNameCheck){
      setError("Edit profile to update");
      return
    }

    try {
      // reauthenticating user 
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential)
      console.log("re authentication successful")
    } catch (e) {
      setError("Invalid Password, try again");
      return
    }


    try {
      await nhaService.updateUser(user, email, firstName, lastName, emailCheck, fNameCheck, lNameCheck);
      
        if (emailCheck) {
          // if email changed
          verifyBeforeUpdateEmail(auth.currentUser, email)
            .then(async () => {
              console.log("Verification email sent!")

              signOut(auth).then(() => {
                navigate("/login")
                const msg = () => toast(`Email change initiated, check your inbox and profile updated :)`);
                msg()
              }).catch((e) => {
                setError(e.message);
                console.log(e)
              })
            }).catch((e) => {
              console.log(e)
              setError("An error occured when updating!")
              return
            })
        } else {
          const msg = () => toast(`Profile updated :)`);
          msg()
        }
      
    } catch (e) {
      setError("Error updating profile")
      return
    }
 }

  return receivedData && (
        <div className='settings-div'>
          <div className='settings-head-div'>
            <FontAwesomeIcon size='4x' icon={faGear} className='settings-icon' />
            <p className='settings-head-p'>Settings</p>
          </div>

          <p className='edit-profile'>Edit Profile</p>

          <form className='settings-form'>
            <div className="names-box">
              <input
                className="name-input-box-settings"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  setError(null)
                }}
                placeholder="First Name"
                style={{
                  borderColor: error ? 'red' : '#0ac6c0',
                  transition: 'border-color 0.3s ease',
                }}
              />
              <input
                className="name-input-box-settings"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  setError(null)
                }}
                placeholder="Last Name"
                style={{
                  borderColor: error ? 'red' : '#0ac6c0',
                  transition: 'border-color 0.3s ease',
                }}
              />
            </div>
            {user && (
              <>
                <input
                  className='settings-email-input'
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  placeholder="Email"
                  style={{
                    borderColor: error ? 'red' : '#0ac6c0',
                    transition: 'border-color 0.3s ease',
                  }}
                />
                <input
                  className='settings-email-input'
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(null)
                  }}
                  placeholder='Enter password before updating'
                  style={{
                    borderColor: error ? 'red' : '#0ac6c0',
                    transition: 'border-color 0.3s ease',
                  }}
                />
              </>)}
            <button type="submit" className='login-btn' onClick={handleUpdateprofile}>Update Profile</button>

          </form>

          <div className="options-div">
            <div className='option-div hover-div1' onClick={handleChangePassword}>
              <FontAwesomeIcon icon={faPenToSquare} />
              <p>Change Password</p>
            </div>
            <div className='option-div hover-div2' onClick={handleDeleteAccount}>
              <FontAwesomeIcon icon={faTrash} />
              <p>Delete Account</p>
            </div>
          </div>

          {error && <p className='error-msg error-settings'>{error}</p>}


        </div>
      )
    }

export default Settings

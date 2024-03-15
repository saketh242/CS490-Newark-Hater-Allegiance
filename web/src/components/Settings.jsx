import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../useAuth';
import { auth } from "../firebase";
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, signOut, onAuthStateChanged } from "firebase/auth";
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

    try {
      // re authenticating the user before updating anything
      try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential)
        console.log("re authentication successful")
      } catch (e) {
        setError("Invalid Password, try again");
        return
      }

      nhaService.updateUser(user, email, firstName, lastName, emailCheck, fNameCheck, lNameCheck)
        .then(async (res) => {
          // res is the user object now send verification email
          console.log(res)
          // logging in with new details, only if email was changed
          if (emailCheck) {
            await signInWithEmailAndPassword(auth, email, password);
            // sending verification
            sendEmailVerification(auth.currentUser);
            // now signingout
            signOut(auth).then(() => {
              navigate("/login")
              console.log("Signed out successfully")
              const msg = () => toast(`Email address chnaged, you need to verify the email to use the app tho`);
              msg()
            })
          }
          setTriggerEffect(!triggerEffect)
        }).catch((error) => {
          console.log(error)
        })



    } catch (e) {
      console.log(e)
      setError("Error updating profile");
    }




  }


  return receivedData && (
    <div className='settings-div'>
      <div className='settings-head-div'>
        <FontAwesomeIcon size='4x' icon={faGear} />
        <p className='settings-head-p'>Settings</p>
      </div>

      <p className='edit-profile'>Edit Profile</p>

      <form className='settings-form'>
        <div className="names-box">
          <input
            className="name-input-box-settings"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            onChange={(e) => setLastName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password before updating'
              style={{
                borderColor: error ? 'red' : '#0ac6c0',
                transition: 'border-color 0.3s ease',
              }}
            />
          </>)}
        <button type="submit" className='login-btn' onClick={handleUpdateprofile}>Update Profile</button>
        {error && <p className='error-msg'>{error}</p>}
      </form>


    </div>
  )
}

export default Settings

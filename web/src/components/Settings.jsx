import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from "../firebase"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faPenToSquare, faShieldHalved, faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { EmailAuthProvider, reauthenticateWithCredential, signOut, verifyBeforeUpdateEmail, updateProfile } from "firebase/auth"
import nhaService from '../services/nhaService'
import { useDispatch, useSelector } from 'react-redux'
import { setDbUser } from '../features/user/userSlice'

const Settings = () => {

  const user = useSelector((state) => state.user.user)
  const dbUser = useSelector((state) => state.user.dbUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [firstName, setFirstName] = useState(dbUser ? dbUser.firstName : "")
  const [lastName, setLastName] = useState(dbUser ? dbUser.lastName : "")
  const [email, setEmail] = useState(user ? user.email : "")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(dbUser || {})
  // const [receivedData, setReceivedData] = useState(false)
  // const [triggerEffect, setTriggerEffect] = useState(true)

  const handleChangePassword = () => {navigate("/changePassword") }
  const handleDeleteAccount = () => {navigate("/deleteAccount")}
  const handle2FA = () => {navigate("/enable2FA")}

  const handleUpdateprofile = async (e) => {
    e.preventDefault()
    if (firstName === "" || lastName === "" || email === "") {
      setError("Fields cannot be empty (¬_¬ )")
      return
    }

    if (password === "") {
      setError("Enter password to update profile")
      return
    }

    const emailCheck = email === user.email ? false : true
    const fNameCheck = firstName === userData.firstName ? false : true
    const lNameCheck = lastName === userData.lastName ? false : true

    if (!emailCheck && !fNameCheck && !lNameCheck) {
      setError("Edit profile to update")
      return
    }

    // field validation done, now reauthenticating the user
    const firebaseUser = auth.currentUser
    try {
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(firebaseUser, credential)
    } catch (e) {
      setError("Invalid Password, try again!")
      return
    }

    try {
      // using a firebaseUser because, the user object I have right now is not a exact firebaase object
      // redux only likes serilizable data so i need to get only the data we need

      await nhaService.updateUser(firebaseUser, email, firstName, lastName, emailCheck, fNameCheck, lNameCheck)
      await updateProfile(firebaseUser, { displayName: `${firstName}` })
      // update dbUser in redux
      const obj = { firstName: firstName, lastName: lastName, email: email, _id: dbUser._id }
      dispatch(setDbUser(obj))
      setUserData(obj)
      setPassword("")

      //changing emails in firebase
      try {
        if (emailCheck) {
          verifyBeforeUpdateEmail(firebaseUser, email)
            .then(() => {
              signOut(auth)
                .then(() => {
                  navigate("/login")
                  toast(`Email change initiated, check your inbox and profile updated :)`)
                }).catch((e) => {
                  setError("Error signing out!")
                  return
                })

            }).catch((e) => {
              setError("An error occured when sending the email")
              return
            })
        } else {
          if (fNameCheck || lNameCheck) toast(`Profile updated :)`)
        }
      } catch (e) {
        setError("An error occured while updating email")
        return
      }
    } catch (e) {
      setError("Error updating profile")
      return
    }
  }

  return (
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
            data-testid="firstNameInput"
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
            data-testid="lastNameInput"
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
              data-testid="password-id-settings"
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
        <button type="submit" data-testid="update-btn" className='login-btn' onClick={handleUpdateprofile}>Update Profile</button>
      </form>

      <div className="options-div">
        <div className='option-div hover-div' onClick={handleChangePassword}>
          <FontAwesomeIcon icon={faPenToSquare} />
          <p>Change Password</p>
        </div>
        <div className='option-div hover-div' onClick={handleDeleteAccount}>
          <FontAwesomeIcon icon={faTrash} />
          <p data-testid="deleteAccount">Delete Account</p>
        </div>
        {user.emailVerified &&
          <div className='option-div hover-div' onClick={handle2FA}>
            <FontAwesomeIcon icon={faShieldHalved} />
            <p>Enable 2FA</p>
          </div>}
      </div>

      {error && <p className='error-msg error-settings'>{error}</p>}
    </div>
  )
}

export default Settings

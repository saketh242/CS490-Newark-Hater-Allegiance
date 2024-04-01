import useAuth from '../useAuth';
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Gravatar from 'react-gravatar'

const ViewProfile = () => {

  const { user, isLoading, name, dbUser } = useAuth();
  const navigate = useNavigate()

  const redirectSettings = () => {
    navigate("/settings");
  }


  return user && dbUser && (
    <div className="profile-info-div">

        <h2 className='view-profile-head'>Profile Details</h2>

      <div className='details-view-profile'>
        <Gravatar email={user.email} size={300} className='profileAvatar' default="mp"/>
        <p>Name: {`${dbUser.firstName} ${dbUser.lastName}`}</p>
        <p>Email: {user.email}</p>
        <p>Last Login: {user.metadata.lastSignInTime}</p>
        <p>Account created at: {user.metadata.creationTime}</p>
        <p>Email Verified: {user.emailVerified? "Yes" : "No"}</p>
      </div>

      <div className='settings-div-view' onClick={redirectSettings}>
      <FontAwesomeIcon size='2x' icon={faGear} />
      <p className='settings-p-tag-view'>Settings</p>
      </div>
    </div>
  )
}

export default ViewProfile

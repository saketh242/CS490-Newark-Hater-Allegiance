import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import { useSelector } from 'react-redux'

const ViewProfile = () => {

  const user = useSelector((state) => state.user.user)
  const dbUser = useSelector((state) => state.user.dbUser)
  const navigate = useNavigate()
  const redirectSettings = () => navigate("/settings")

  return user && dbUser && (
    <div className="profile-info-div">
      <h2 className='view-profile-head'>Profile Details</h2>
      
      <div className='details-view-profile'>
        <div className="gravatarContainer">
          <Gravatar email={user.email} size={225} className='profileAvatar' id="profilePagePic" default="mp" />
        </div>
        <Link to="/help" className='link' id="gravatarNote">Help: How to set a profile picture</Link>
        <div className="profile-info-text">
          <div className="profileSegment">
            <h3>Personal Information</h3>
            <div className="profilePersonalInfo">
              <p>Name: {`${dbUser.firstName} ${dbUser.lastName}`}</p>
              <p>Email: {user.email}</p>
            </div>
          </div>
          <div className="profileSegment">
            <h3>Account information</h3>
            <div className="profileAccountInfo">
              <p>Last Login: {user.metadata.lastSignInTime}</p>
              <p>Account created at: {user.metadata.creationTime}</p>
              <p>Email verified: {user.emailVerified ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='settings-div-view' onClick={redirectSettings}>
        <FontAwesomeIcon size='2x' icon={faGear} />
        <p className='settings-p-tag-view'>Settings</p>
      </div>
    </div>
  )
}

export default ViewProfile

import React from 'react'

const LatestPatch = () => {
  return (
    <div>
        <h1 className='help-header fiery-red' id='patch-notes-header'>What's New!</h1>
        <p>Added:</p>
        <ul className='instructions'>
            <li>New Help page</li>
            <li>2FA login method</li>
            <li>Home reviews and average reviews display</li>
            <li>Gravatar integration with profiles</li>
            <li>New History tab on translate page</li>
        </ul>
        <br/>
        <p>Updated:</p>
        <ul className='instructions'>
            <li>Translator output now has syntax highlighting</li>
            <li>Profile page redesign</li>
            <li>Getting started section reworked on home page (old one moved to help page)</li>
        </ul>
    </div>
  )
}

export default LatestPatch
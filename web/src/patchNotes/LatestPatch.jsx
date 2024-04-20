import React from 'react'

const LatestPatch = () => {
  return (
    <div>
        <h1 className='help-header fiery-red' id='patch-notes-header'>What's New!</h1>
        {/* COPY PASTE NEW PATCH HERE WITHOUT CLICKABLE FUNCTIONALITY (the following line should be h1, not span) */}
        <h1 className='help-header bold'>v0.4.1</h1>
        <p>Added:</p>
        <ul className='instructions'>
            <li>2FA functionality to accounts</li>
        </ul>
        <br/>
        <p>Updated:</p>
        <ul className='instructions'>
            <li>Patch notes are now toggable to reduce clutter on the screen</li>
        </ul>
    </div>
  )
}

export default LatestPatch
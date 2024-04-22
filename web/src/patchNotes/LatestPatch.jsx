import React from 'react'

const LatestPatch = () => {
  return (
    <div>
        {/* COPY PASTE NEW PATCH HERE WITHOUT CLICKABLE FUNCTIONALITY (the following line should be h1, not span) */}
        <h1 className='help-header bold'>v1.0.0</h1>
        <p>Added:</p>
        <ul className='instructions'>
            <li>App deployment now online!</li>
        </ul>
        <br/>
        <p>Updated:</p>
        <ul className='instructions'>
            <li>2FA popups tweaked</li>
            <li>Help page tweaks</li>
        </ul>
    </div>
  )
}

export default LatestPatch
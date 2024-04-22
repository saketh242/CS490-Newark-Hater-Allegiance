import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

const Patch_1_0_0 = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <div id='patch-note'>
      <FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={open ? faCaretDown : faCaretRight} />
      <span className='help-header bold hover' onClick={handleOpen}>v1.0.0</span>
      {open ? <div>
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
      </div> : null}
  </div>
  )
}

export default Patch_1_0_0
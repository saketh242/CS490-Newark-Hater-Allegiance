import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

const Patch_0_4_2 = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <div>
      <FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={open ? faCaretDown : faCaretRight} />
      <span className='help-header bold hover' onClick={handleOpen}>v0.4.2</span>
      {open ? <div>
        <p>Added:</p>
        <ul className='instructions'>
            <li>2FA functionality to accounts</li>
        </ul>
        <br/>
        <p>Updated:</p>
        <ul className='instructions'>
            <li>Patch notes are now toggable to reduce clutter on the screen</li>
        </ul>
      </div> : null}
  </div>
  )
}

export default Patch_0_4_2
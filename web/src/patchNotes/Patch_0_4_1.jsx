import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

const Patch_0_4_1 = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <div>
      <FontAwesomeIcon id='auto-icon' className='help-icon' size='1x' icon={open ? faCaretDown : faCaretRight} />
      <span className='help-header' id='faq-header' onClick={handleOpen}>v0.4.1</span>
      {open ? <div>
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
      </div> : null}
    </div>
  )
}

export default Patch_0_4_1
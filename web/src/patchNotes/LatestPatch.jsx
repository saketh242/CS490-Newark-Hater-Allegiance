import React from 'react'
import Patch_0_4_2 from './Patch_0_4_2' // UPDATE THIS TO THE LATEST PATCH EVERY TIME

const LatestPatch = () => {
  return (
    <div>
        <h1 className='help-header fiery-red' id='patch-notes-header'>What's New!</h1>
        <Patch_0_4_2 />
    </div>
  )
}

export default LatestPatch
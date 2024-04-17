import React from 'react'
import Gravatar from 'react-gravatar'

const Developers = () => {
    return (
        <div className='box' id="devCredits">
        <h2 className='rainbow'>Designed and Developed by</h2>
        <div id="devsArea">
          <div className="dev">
            <p>Saketh <br/> Puramsetti</p>
            <Gravatar email={process.env.REACT_APP_SAKETH_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Saketh'/>
            <p className="role">Project Manager</p>
          </div>
          <div className="dev">
            <p>Medina <br/>Dzhatdoyev</p>
            <Gravatar email={process.env.REACT_APP_MEDINA_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Medina'/>
            <p className="role">Frontend Lead Developer</p>
          </div>
          <div className="dev">
            <p>Ausberto <br/>Colon Jr</p>
            <Gravatar email={process.env.REACT_APP_AJ_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for AJ'/>
            <p className="role">Flex Unit</p>
          </div>
          <div className="dev">
            <p>John <br/>Cena</p>
            <Gravatar email={process.env.REACT_APP_JOHN_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for John'/>
            <p className="role">Frontend Developer</p>
          </div>
          <div className="dev">
            <p>Karam <br/>Assaf</p>
            <Gravatar email={process.env.REACT_APP_KARAM_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for Karam'/>
            <p className="role">Backend Lead Developer</p>
          </div>
        </div>
        
        {/*FUNNY PLAYTESTERS DIV*/}
        {/* <h2 className='rainbow'>Playtested by</h2>
        <div id="devsArea">
          <div className="dev">
            <p>John <br/>Cena</p>
            <Gravatar email={process.env.REACT_APP_JOHN_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for John'/>
            <p className="role">Quality Assurance</p>
          </div>
          <div className="dev">
            <p>William <br/>McCoy</p>
            <Gravatar email={process.env.REACT_APP_KOI_EMAIL} size={225} className='profileAvatar' id="devImage" default="mp" alt='Gravatar for William'/>
            <p className="role">Security Analyst</p>
          </div>
        </div> */}
      </div>
    )
}

export default Developers
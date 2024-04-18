import React, { useState, useMemo } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import VerificationInput from "react-verification-input";
import { toast } from 'react-toastify';

const ControlledCodePopup = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    toast("Success!")
    closeModal()
  }

  const closeModal = () => setOpen(false);
  return (
    <div>
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        Login
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <a className="close" onClick={closeModal}>
            &times;
          </a>
          <div className="popupContent">
          <div id="verificationHeader">
            <h1 id="tfa-header">Two-Factor authentication</h1>
            <p>Enter the code that was sent to</p>
            <p>xxx-xxx-xxxx</p>
          </div>
          <VerificationInput validChars='0-9' onChange={(code) => setCode(code)}
            classNames={{
              container: "otp-container",
              character: "character",
              characterInactive: "character--inactive",
              characterSelected: "character--selected",
              characterFilled: "character--filled",
            }} />
          <button className="default-button" id="otp-button" onClick={handleSubmit}>Done</button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ControlledCodePopup;

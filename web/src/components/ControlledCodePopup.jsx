import { useState } from "react";
import Popup from 'reactjs-popup';

const ControlledCodePopup = ({ open, setOpen}) => {
  const [code, setCode] = useState("");

  const closeModal = () => setOpen(false);

  const handleSubmit = () => {
    closeModal();
  };

  return (
    <div>
      <Popup open={open} onClose={closeModal} >
        <div className="modal">
          <a className="close" onClick={closeModal}>
            &times;
          </a>
          <p>Enter Verification Code</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit Code</button>
        </div>
      </Popup>
    </div>
  );
};

export default ControlledCodePopup;

import React, { useState, useEffect } from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

const sideBarStyle = {
  backgroundColor: "#23262F",
  borderLeftWidth: "medium",
  borderLeftColor: "#076966",
  borderLeftStyle: "solid",
  borderRadius: "14px",
  overflowY: "scroll",
  scrollbarColor: "#076966 #1A1C23",
  scrollbarWidth: "thin",
};

const dateAndTimeConversion = (date) => {
  const dateObject = new Date(date);
  const string = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  });
  return string;
};

const loadInputAndTranslatedCode = (setInputCode, setTranslatedCode, inputCode, translatedCode) => {
  setInputCode(inputCode);
  setTranslatedCode(translatedCode);
}

const History = ({ history, showSidebar, toggleSidebar, setInputCode, setTranslatedCode }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  if (history === null || showSidebar === false) return (<></>);
  return (
    <>
      <Drawer
        open={showSidebar}
        onClose={toggleSidebar}
        direction='right'
        size={width * 0.3}
        style={sideBarStyle}
      >
        <h1 className="translationTitle"> Translation History </h1>
        {history.map((historyLabel, i) => (
          <div className="translationHistory" key={i}>
            <h4>
              {dateAndTimeConversion(history[i].createdAt)}
            </h4>

            <h5>
              Source Code ({history[i].Source_language})
            </h5>
            <p>
              {history[i].original_code}
            </p>

            <h5>
              Converted Code ({history[i].Desired_language})
            </h5>
            <p>
              {history[i].converted_code}
            </p>

            <button onClick={() => loadInputAndTranslatedCode(setInputCode, setTranslatedCode, history[i].original_code, history[i].converted_code)}> Load Code </button>
          </div>
        ))}
      </Drawer>
    </>
  )
}

export default History
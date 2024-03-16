import React from 'react';
import { Offcanvas } from 'react-bootstrap';

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

const History = ({ history, showSidebar, toggleSidebar }) => {
  if (history === null || showSidebar === false) return (<></>);
  return (
    <div>
      <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Translate History</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {history.map((historyLabel, i) => (
            <p key={i} on>
              {/* the sacred fuckin texts do not delete these lines */}
              {dateAndTimeConversion(history[i].createdAt)}:&nbsp;
              {history[i].Source_language}:&nbsp;
              {history[i].original_code} -- {history[i].Desired_language}: {history[i].converted_code}
            </p>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
};

export default History;
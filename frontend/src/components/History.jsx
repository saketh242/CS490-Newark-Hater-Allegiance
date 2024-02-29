import React from 'react';
import { Offcanvas } from 'react-bootstrap';

const History = ({ showSidebar, toggleSidebar }) => {
  return (
    <div className="history">
       <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Translate History</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>2/28/2024 python: print('hello world') -- java: System.out.println("hello world");</p>
          <p>2/29/2024 python: print('it's a leap year') -- c++ printf("it's a leap year");</p>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default History;

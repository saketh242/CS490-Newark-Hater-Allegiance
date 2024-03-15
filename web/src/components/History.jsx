import React from 'react';
import SidebarMenu, { SidebarMenuHeader } from 'react-bootstrap-sidebar-menu';
// import { Offcanvas } from 'react-bootstrap';

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

const History = ({ history, showSidebar }) => {
  if (history === null || showSidebar === false) return (<></>);
  return (
    <SidebarMenu expanded={showSidebar}>
      <SidebarMenuHeader>
        Yeet
      </SidebarMenuHeader>
    </SidebarMenu>
    // <div className="history">
    //   <h1> Translation History </h1>
    //   {history.map((historyLabel, i) => (
    //     <p key={i} on>
    //     {/* the sacred fuckin texts do not delete these lines */}
    //       {dateAndTimeConversion(history[i].createdAt)}:&nbsp; 
    //       {history[i].Source_language}:&nbsp; 
    //       {history[i].original_code} -- {history[i].Desired_language}: {history[i].converted_code}
    //     </p>
    //   ))}
    // </div>
  );
  // return (
  //   <div>
  //     <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start">
  //       <Offcanvas.Header closeButton>
  //         <Offcanvas.Title>Translate History</Offcanvas.Title>
  //       </Offcanvas.Header>
  //       <Offcanvas.Body>
  //         <p>2/28/2024 python: print('hello world') -- java: System.out.println("hello world");</p>
  //         <p>2/29/2024 python: print('it's a leap year') -- c++ printf("it's a leap year");</p>
  //       </Offcanvas.Body>
  //     </Offcanvas>
  //   </div>
  // )
};

export default History;

import React from 'react';

const History = ({ history, toggleSidebar }) => {

  if(history === null) return (<></>);
  return (
    <>
      <h1> Translation History </h1>
      {history.map((historyLabel, i) => (
        <p key={i} >
          {history[i].createdAt} {history[i].Source_language}: {history[i].original_code} --
          {history[i].Desired_language}: {history[i].converted_code}
        </p>
      ))}
    </>
    // <div>
    //    <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start">
    //     <Offcanvas.Header closeButton>
    //       <Offcanvas.Title>Translate History</Offcanvas.Title>
    //     </Offcanvas.Header>
    //     <Offcanvas.Body>
    //       <p>2/28/2024 python: print('hello world') -- java: System.out.println("hello world");</p>
    //       <p>2/29/2024 python: print('it's a leap year') -- c++ printf("it's a leap year");</p>
    //     </Offcanvas.Body>
    //   </Offcanvas>
    // </div>
  );
};

export default History;
// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Home from './components/Home';
import Login from './components/Login';
import Translate from './components/Translate';
import Help from './components/Help';
import NHANav from './components/NHANav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import PageNotFound from "./components/PageNotFound"
import ChangePassword from './components/ChangePassword';
import "./index.css"
import useAuth from './useAuth';
import axios from 'axios'
import DeleteAccount from './components/DeleteAccount';
import Settings from './components/Settings';
import VerificationMessage from './components/VerificationMessage';
import ForgotPassword from './components/ForgotPassword';



const App = () => {

  const { user, isLoading } = useAuth();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return !isLoading && (
    <>
      <Router>

        <div className="content">
          <NHANav />
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={user ? <Navigate to="/"/> : <Login />} />
            <Route path="/translate" element={user ? (user.emailVerified ? <Translate /> : <VerificationMessage/>): <Navigate to="/login"/>} />
            <Route path="/help" element={<Help />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login"/>} />
            <Route path="/changePassword" element={user ? <ChangePassword /> : <Navigate to="/login"/>} />
            <Route path="/deleteAccount" element={user ? <DeleteAccount /> : <Navigate to="/login"/>} />
            <Route path="/forgotPassword" element={!user ? <ForgotPassword/> : <Navigate to = "/"/>}/>
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </div>
        <Footer />
        {/* <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition:Bounce /> */}
        <ToastContainer
          position="bottom-right"
          autoClose={2000} 
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{ backgroundColor: '#5469D4', color: '#BDC3D0' }}
        />
      </Router>
    </>
  );
};

export default App;
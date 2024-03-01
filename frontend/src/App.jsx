// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Home from './components/Home';
import Login from './components/Login';
import Translate from './components/Translate';
import Docs from './components/Docs';
import NHANav from './components/NHANav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import "./index.css"
import useAuth from './useAuth';
import axios from 'axios'


const App = () => {

  const { user, isLoading } = useAuth();

  return !isLoading && (
    <>
      <Router>

        <div className="content">
          <NHANav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user? <Home/>:<Login />} />
            <Route path="/translate" element={<Translate />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer
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
          transition:Bounce />
      </Router>
    </>
  );
};

export default App;
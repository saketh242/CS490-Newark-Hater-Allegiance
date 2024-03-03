// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Home from './components/Home';
import Login from './components/Login';
import Translate from './components/Translate';
import Docs from './components/Docs';
import NHANav from './components/NHANav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import PageNotFound from "./components/PageNotFound"
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
            <Route path="/login" element={user ? <Navigate to="/"/> : <Login />} />
            <Route path="/translate" element={user ? <Translate /> : <Navigate to="/login"/>} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<PageNotFound />} />
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
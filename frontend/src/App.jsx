// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase';


import Home from './components/Home';
import Login from './components/Login';
import Translate from './components/Translate';
import Docs from './components/Docs';
import NHANav from './components/NHANav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import "./index.css"
import axios from 'axios'


const App = () => {

  
  const fetchData = async (token) => {
    const res = await axios.get("http://localhost:3000/test", {
      headers: {
        Authorization: 'Bearer '+token
      }
    })
    console.log(res.data);
  }

  useEffect(()=>{
    if (token){
      fetchData(token)
    }
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is logged in
          const uid = user.uid;
          console.log("uid", uid)
        } else {
          // User is logged out
          console.log("user is logged out")
        }
      });
     
  },[token])

  return (
    <>
    <Router>
      
      <div className="content">
      <NHANav/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken}/>} />
          <Route path="/translate" element={<Translate/>}/>
          <Route path="/docs" element={<Docs />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
    </>
  );
};

export default App;
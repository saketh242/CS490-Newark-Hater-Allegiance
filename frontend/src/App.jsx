// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Translate from './components/Translate';
import Docs from './components/Docs';
import NHANav from './components/NHANav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import "./index.css"


const App = () => {
  return (
    <>
    <Router>
      
      <div className="content">
      <NHANav/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/translate" element={<Translate />} />
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
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Translate from './components/Translate';
import Docs from './components/Docs';
import NHANav from './components/NHANav';
import "./index.css"

const App = () => {
  return (
    <>
    <Router>
      <NHANav/>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
        <p className="test">Hello World! :3</p>
      </div>
    </Router>
    </>
  );
};

export default App;
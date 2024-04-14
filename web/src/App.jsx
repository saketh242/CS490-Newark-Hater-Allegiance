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
// import { useDispatch } from 'react-redux';
// import axios from 'axios'
import DeleteAccount from './components/DeleteAccount';
import Settings from './components/Settings';
import VerificationMessage from './components/VerificationMessage';
import ForgotPassword from './components/ForgotPassword';
// import nhaService from './services/nhaService';
import ViewProfile from './components/ViewProfile';
import { useSelector } from 'react-redux';
// import { setReviews, startFetchingReviews, stopFetchingReviews } from './features/reviews/reviewSlice';
import useFetchReviews from './useFetchReviews';
import useAverageRatings from './useAverageRatings';
import ScrollToTop from './utils/scrollToTop';

const App = () => {
  useAuth();
  useFetchReviews();
  useAverageRatings();
  const user = useSelector((state) => state.user.user);
  const dbUser = useSelector((state) => state.user.dbUser);
  const isLoading = useSelector((state) => state.user.isLoading);
  const { setShouldFetch } = useFetchReviews();

  useEffect(() => {
    if (!isLoading) {
      setShouldFetch(true);
    }
  }, [isLoading, setShouldFetch]);
  
  if (isLoading) {
    return <div id='loading-page'><h1 className='rainbow-fast'>Loading...</h1></div>;
  }
  return !isLoading && (
    <>
      <Router>
        <div className="content">
        <ScrollToTop />
          <NHANav/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/"/> : <Login />} />
            <Route path="/translate" element={user ? (user.emailVerified ? <Translate /> : <VerificationMessage/>): <Navigate to="/login"/>} />
            <Route path="/help" element={<Help />} />
            <Route path="/signup" element={user ? <Navigate to="/"/> : <Signup />} />
            <Route path="/settings" element={user ?  <Settings /> : <Navigate to="/login"/>}  />
            <Route path="/changePassword" element={user ? <ChangePassword /> : <Navigate to="/login"/>} />
            <Route path="/deleteAccount" element={user ? <DeleteAccount /> : <Navigate to="/login"/>} />
            <Route path="/forgotPassword" element={!user ? <ForgotPassword/> : <Navigate to = "/"/>}/>
            <Route path="/viewProfile" element={user ? <ViewProfile/>: <Navigate to="/login"/>}/>
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </div>
        <Footer />

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
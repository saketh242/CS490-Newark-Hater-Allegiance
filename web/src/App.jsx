import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import "./index.css"
import useAuth from './useAuth'
import { useSelector } from 'react-redux'
import useFetchReviews from './useFetchReviews'
import useAverageRatings from './useAverageRatings'
import useHistoryManagement from './useHistoryManagement'
import ScrollToTop from './utils/scrollToTop'

import Loading from './components/Loading'
const Home = lazy( () => import('./components/Home'))
const Login = lazy( () => import('./components/Login'))
const Translate = lazy( () => import('./components/Translate'))
const Help = lazy( () => import('./components/Help'))
const NHANav = lazy( () => import('./components/NHANav'))
const Signup = lazy( () => import('./components/Signup'))
const PageNotFound = lazy( () => import('./components/PageNotFound'))
const ChangePassword = lazy( () => import('./components/ChangePassword'))
const Enable2FA = lazy( () => import('./components/Enable2FA'))
const DeleteAccount = lazy( () => import('./components/DeleteAccount'))
const Settings = lazy( () => import('./components/Settings'))
const VerificationMessage = lazy( () => import('./components/VerificationMessage'))
const ForgotPassword = lazy( () => import('./components/ForgotPassword'))
const ViewProfile = lazy( () => import('./components/ViewProfile'))
const Footer = lazy( () => import('./components/Footer'))

const App = () => {
  useAuth()
  useFetchReviews()
  useAverageRatings()
  const { setFetch } = useHistoryManagement()

  const user = useSelector((state) => state.user.user)
  const isLoading = useSelector((state) => state.user.isLoading)
  const { setShouldFetch } = useFetchReviews()
  useEffect(() => {if (!isLoading) setShouldFetch(true)}, [isLoading, setShouldFetch, setFetch])

  return (
    <>
    
      <Router>
        <div className="content">
        <ScrollToTop />
        <Suspense><NHANav /></Suspense>
          <Routes>
            <Route path="/" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
            <Route path="/login" element={user ? <Navigate to="/"/> : <Suspense fallback={<Loading />}><Login /></Suspense>} />
            <Route path="/translate" element={user ? (user.emailVerified ? <Suspense fallback={<Loading />}><Translate /></Suspense> : <Suspense><VerificationMessage /></Suspense>): <Navigate to="/login"/>} />
            <Route path="/help" element={<Suspense fallback={<Loading />}><Help /></Suspense>} />
            <Route path="/signup" element={user ? <Navigate to="/"/> : <Suspense fallback={<Loading />}><Signup /></Suspense>} />
            <Route path="/settings" element={user ?  <Suspense fallback={<Loading />}><Settings /></Suspense> : <Navigate to="/login"/>}  />
            <Route path="/changePassword" element={user ? <Suspense fallback={<Loading />}><ChangePassword /></Suspense> : <Navigate to="/login"/>} />
            <Route path="/deleteAccount" element={user ? <Suspense fallback={<Loading />}><DeleteAccount /></Suspense> : <Navigate to="/login"/>} />
            <Route path="/forgotPassword" element={!user ? <Suspense fallback={<Loading />}><ForgotPassword /></Suspense> : <Navigate to = "/"/>}/>
            <Route path="/viewProfile" element={user ? <Suspense fallback={<Loading />}><ViewProfile /></Suspense>: <Navigate to="/login"/>}/>
            <Route path="/enable2FA" element={user ? (user.emailVerified ? <Suspense fallback={<Loading />}><Enable2FA /></Suspense> : <Suspense><VerificationMessage /></Suspense>): <Navigate to="/login"/>}/>
            <Route path="/*" element={<Suspense fallback={<Loading />}><PageNotFound /></Suspense>} />
          </Routes>
        </div>
        <Suspense fallback={<div></div>}><Footer /></Suspense>

        <ToastContainer
          position="bottom-right" autoClose={2000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} 
          pauseOnFocusLoss draggable pauseOnHover toastStyle={{ backgroundColor: '#5469D4', color: '#BDC3D0' }}
        />
      </Router>
    </>
  )
}

export default App
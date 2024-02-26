import { useState } from 'react';
import { Link } from "react-router-dom"

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("https://status.openai.com/api/v2/summary.json")
      .then((res) => {
        return res.json()
      })
      .then ((data) => {
        console.log(data)
      }).catch((e) => {console.log(e)})
  }
  return (
    <div className='login-content'>
     <h2 className="login-heading">NHAGPT</h2>
     <div className="login-box">
     <input
          className='email-input'
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input 
        className='password-login'
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        />
        <button type="submit" className='login-btn' onClick={handleLogin}>Login</button>
        <div className='signup-msg'>
          <p>No Account?</p>
          <Link to="/signup">
            Signup
          </Link>
        </div>
     </div>
    </div>
  )
}

export default Login

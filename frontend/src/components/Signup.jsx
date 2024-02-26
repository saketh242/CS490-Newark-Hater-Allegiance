import {useState} from "react"

const Signup = () => {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const handleSignup = () => {
        console.log("You Signed up!")
    }

  return (
    <div className='signup-content'>
     <h2 class="login-heading">NHAGPT</h2>
     <div class="signup-box">
        <div className="name-inputs">
            <input
                className="name-input-box"
                type="text"
                value={text}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
            />
            <input
                className="name-input-box"
                type="text"
                value={text}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
            />
        </div>
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
        <input 
        className='password-login'
        type="password" 
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        placeholder="Retype Password"
        />
        <button type="submit" className='login-btn' onClick={handleSignup}>Signup</button>
        <div className='signup-msg'>
          <p>Already have an account</p>
          <Link to="/login">
            Login
          </Link>
        </div>
     </div>
    </div>
  )
}

export default Signup

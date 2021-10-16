import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as EmailValidator from 'email-validator';
import { passwordStrength } from 'check-password-strength'
import './Login.css'

const Login = () => {

  const [email, setEmail] = useState({value: '', valid: false})
  const [password, setPassword] = useState({value: '', strength: false})
 
  const handleInputChange = (e, inputType) => {
    console.log(inputType)
    console.log(e.target.value)

    switch(inputType) {
      case 'email':
        setEmail(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
      default:
        return
    }
  }

  return (
    <div className="registerContainer">
      <h1>
        Welcome Back
      </h1>

      <div className="loginQuery">Don't have an account? <Link to="/login">Sign up</Link></div>

      <button><i class="fab fa-google"></i> Continue with Google</button>
      <button><i class="fab fa-apple"></i> Continue with Apple</button>
      <button><i class="fab fa-facebook-f"></i> Continue with Facebook</button>

      <div className="orOption"><span>or</span></div>

      <button><i class="fas fa-envelope"></i>Log in with Email</button>

      <div>
        <input type="text" placeholder="Email Address" value={email.value} onChange={(e) => handleInputChange(e, 'email')}/>
        {email.length === 0 
        ? <div className="invalidInput">Your email address is required.</div> 
        : !EmailValidator.validate(email) ? <div className="invalidInput">Please enter a valid email address.</div>
        : ''}

      </div>
      
      <div className="passwordContainer">
        <input type="password" placeholder="Password" value={password.value} onChange={(e) => handleInputChange(e, 'password')}/>
      </div>

      <div>
        <button className="createAccountButton">Log in</button>
      </div>


    </div>
  )
}

export default Login;
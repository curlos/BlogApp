import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as EmailValidator from 'email-validator';
import { passwordStrength } from 'check-password-strength'
import './Register.css'

const Register = () => {

  const [firstName, setFirstName] = useState({value: '', valid: false})
  const [lastName, setLastName] = useState({value: '', valid: false})
  const [email, setEmail] = useState({value: '', valid: false})
  const [password, setPassword] = useState({value: '', strength: false})
  const [confirmPassword, setConfirmPassword] = useState({value: '', strength: false})

  const handleInputChange = (e, inputType) => {
    console.log(inputType)
    console.log(e.target.value)

    switch(inputType) {
      case 'firstName':
        setFirstName({value: e.target.value, valid: handleValidInput('firstName', e.target.value)})
        break
      case 'lastName':
        setLastName({value: e.target.value, valid: handleValidInput('lastName', e.target.value)})
        break
      case 'email':
        setEmail({value: e.target.value, valid: handleValidInput('email', e.target.value)})
        break
      case 'password':
        setPassword({value: e.target.value, strength: handleValidInput('password', e.target.value)})
        break
      case 'confirmPassword':
        setConfirmPassword({value: e.target.value, strength: handleValidInput('confirmPassword', e.target.value)})
        break
      default:
        return
    }
  }

  const handleValidInput = (inputType, inputValue) => {
    console.log(inputType)
    console.log(EmailValidator.validate(inputValue))

    switch(inputType) {
      case 'firstName':
        return inputValue.length > 0
      case 'lastName':
        return inputValue.length > 0
      case 'email':
        return EmailValidator.validate(inputValue)
      case 'password':
        return passwordStrength(inputValue).value
      case 'confirmPassword':
        return passwordStrength(inputValue).value
      default:
        return
    }
  }

  const getPasswordMeter = () => {

    switch(password.strength) {
      case 'Too weak':
        return (
        <span>
          Too weak <meter className="passwordMeter tooWeak" value="2" min="0" max="10"></meter>
        </span>)

      case 'Weak':
        return (
          <span>
            Weak <meter className="passwordMeter weak" value="4" min="0" max="10"></meter>
          </span>)
      case 'Medium':
        return (
          <span>
            Medium <meter className="passwordMeter medium" value="7" min="0" max="10"></meter>
          </span>)
      case 'Strong':
        return (
          <span>
            Strong <meter className="passwordMeter strong" value="10" min="0" max="10"></meter>
          </span>)
      default:
        return
    }
  }

  const passwordsMatch = () => {
    return password.value === confirmPassword.value
  }

  console.log([
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ])

  

  return (
    <div className="registerContainer">
      <h1>
        Create Account
      </h1>

      <div className="loginQuery">Already have an account? <Link to="/login">Log in</Link></div>

      <button><i class="fab fa-google"></i> Continue with Google</button>
      <button><i class="fab fa-apple"></i> Continue with Apple</button>
      <button><i class="fab fa-facebook-f"></i> Continue with Facebook</button>

      <div className="orOption"><span>or</span></div>

      <button><i class="fas fa-envelope"></i> Sign up with Email</button>

      <div className="names">
        <div className="firstNameContainer">
          <input type="text" placeholder="First Name" value={firstName.value} onChange={(e) => handleInputChange(e, 'firstName')}/>
          {!firstName.valid ? <div className="invalidInput">Your first name is required.</div> : ''}
        </div>

        <div className="lastNameContainer">
          <input type="text" placeholder="Last Name" value={lastName.value} onChange={(e) => handleInputChange(e, 'lastName')}/>
          {!lastName.valid ? <div className="invalidInput">Your last name is required.</div> : ''}
        </div>
      </div>

      <div>
        <input type="text" placeholder="Email Address" value={email.value} onChange={(e) => handleInputChange(e, 'email')}/>
        {email.value.length === 0 
        ? <div className="invalidInput">Your email address is required.</div> 
        : !email.valid ? <div className="invalidInput">Please enter a valid email address.</div>
        : ''}

      </div>
      
      <div className="passwordContainer">
        <input type="password" placeholder="Password" value={password.value} onChange={(e) => handleInputChange(e, 'password')}/>
        {password.value.length === 0 ? <div className="invalidInput">Password must be at least 8 characters.</div> : getPasswordMeter()}
      </div>

      <div className="passwordContainer">
        <input type="password" placeholder="Confirm Password" value={confirmPassword.value} onChange={(e) => handleInputChange(e, 'confirmPassword')}/>
      </div>

      {!passwordsMatch() ? <div className="invalidInput">Passwords do not match</div> : ''}

      <div>
        <button className="createAccountButton">Create Account</button>
      </div>


    </div>
  )
}

export default Register;
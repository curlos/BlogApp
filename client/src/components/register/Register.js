import axios from 'axios';
import { passwordStrength } from 'check-password-strength';
import * as EmailValidator from 'email-validator';
import React, { useState } from "react";
import {
  Link,
  useHistory
} from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import './Register.css';

const Register = () => {

  // eslint-disable-next-line no-unused-vars
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()

  const [firstName, setFirstName] = useState({value: '', valid: false})
  const [lastName, setLastName] = useState({value: '', valid: false})
  const [email, setEmail] = useState({value: '', valid: false})
  const [password, setPassword] = useState({value: '', strength: false})
  const [confirmPassword, setConfirmPassword] = useState({value: '', strength: false})
  const [errMessage, setErrMessage] = useState('')

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

  const allValid = () => {
    console.log([firstName, lastName, email, password])
    
    for (let obj of [firstName, lastName, email, password]) {
      if (obj.strength) {
        continue
      }

      if (!obj.valid) {
        return false
      }
    }

    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!allValid()) {
      return
    }

    console.log('reg')

    const body = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    }

    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/register`, body)
    
    console.log(response.data)

    if (response.data.result) {
      history.push('/')
    } else if (response.data.error) {
      setErrMessage(response.data.error)
    }
  }

  if (Object.keys(loggedInUser).length > 0) {
    history.push('/')
  }
  

  return (
    <form className="registerContainer" onSubmit={handleRegister}>
      <h1>
        Create Account
      </h1>

      <div className="loginQuery">Already have an account? <Link to="/login">Log in</Link></div>

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
        <button className="createAccountButton" onClick={handleRegister}>Create Account</button>
      </div>

      <div className="errorMessage">{errMessage}</div>


    </form>
  )
}

export default Register;
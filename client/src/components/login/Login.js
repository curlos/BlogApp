import axios from "axios";
import * as EmailValidator from 'email-validator';
import React, { useEffect, useState } from "react";
import {
  Link,
  useHistory
} from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import './Login.css';

const Login = () => {

  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()
  const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/users`

  const [email, setEmail] = useState({value: '', valid: false})
  const [password, setPassword] = useState({value: '', strength: false})

  useEffect(() => {
    window.scrollTo(0,0)
  }, [])
 
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

  const handleLogin = async (e) => {
    e.preventDefault()

    const body = {
      email,
      password
    }
    const response = await axios.post(SERVER_URL + `/login`, body)

    if (response.data.user) {
      setLoggedInUser(response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      history.push('/')
    }
  }

  if (Object.keys(loggedInUser).length > 0) {
    history.push('/')
  }

  return (
    <div className="registerContainer">
      <h1>
        Welcome Back
      </h1>

      <div className="loginQuery">Don't have an account? <Link to="/register">Sign up</Link></div>

      <form onSubmit={handleLogin}>
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
          <button className="createAccountButton" onClick={handleLogin}>Log in</button>
        </div>
      </form>


    </div>
  )
}

export default Login;
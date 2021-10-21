import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import './Settings.css'
import UserContext from '../../contexts/UserContext'
import axios from "axios";

const Settings = () => {
  
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)


  const [firstName, setFirstName] = useState(loggedInUser.firstName)
  const [lastName, setLastName] = useState(loggedInUser.lastName)
  const [email, setEmail] = useState(loggedInUser.email)
  const [password, setPassword] = useState(loggedInUser.password)
  const [aboutMe, setAboutMe] = useState(loggedInUser.aboutMe)
  const [profilePicture, setProfilePicture] = useState(loggedInUser.profilePic)
  const [loading, setLoading] = useState(true)

  return (
    <div className="settingsContainer">
      <div className="settingsTitle"><h2>Account</h2></div>

      <div>Profile Picture</div>

      <div>First name</div>
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>

      <div>Last name</div>
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>

      <div>Email</div>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>

      <div>Password</div>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

      <div>About me</div>
      <textarea className="aboutMeTextarea" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)}></textarea>
      
      <button className="updateProfileButton">Update profile</button>
      <button className="deleteAccountButton">Delete account</button>
    </div>
    
  )
}

export default Settings;
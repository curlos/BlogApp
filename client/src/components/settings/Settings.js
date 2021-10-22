import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import './Settings.css'
import UserContext from '../../contexts/UserContext'
import axios from "axios";

const Settings = () => {
  
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()
  const IMAGES_LOCATION = 'http://localhost:8888/images/'


  const [firstName, setFirstName] = useState(loggedInUser.firstName)
  const [lastName, setLastName] = useState(loggedInUser.lastName)
  const [email, setEmail] = useState(loggedInUser.email)
  const [password, setPassword] = useState(loggedInUser.password)
  const [aboutMe, setAboutMe] = useState(loggedInUser.aboutMe)
  const [profilePic, setProfilePic] = useState(loggedInUser.profilePic || null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)

  if (Object.keys(loggedInUser).length < 1) {
    history.push('/')
  }

  const handleUpdateProfile = async () => {
    const body = {
      firstName,
      lastName,
      email,
      password,
      aboutMe,
      profilePic
    }

    if (file) {
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append('name', filename)
      data.append('file', file)
      body.profilePic = filename

      try {
        const response = await axios.post('http://localhost:8888/upload', data)

        console.log(response)
      } catch (err) {
        console.log(err)
        return
      }
    }

    const response = await axios.put(`http://localhost:8888/users/user/update/${loggedInUser._id}`, body)

    console.log(response.data)
    setLoggedInUser(response.data)

    history.push(`/author/${loggedInUser._id}`)
  }

  console.log(loggedInUser)

  return (
    <div className="settingsContainer">
      <div className="settingsTitle"><h2>Account</h2></div>

      {(file || profilePic) && (
        <img className="profilePicImg" src={file ? URL.createObjectURL(file) : IMAGES_LOCATION + profilePic } alt="" />
      )}

      <div>Profile Pic: </div>
      <input 
        type="file" 
        id="fileInput" 
        onChange={(e) => setFile(e.target.files[0])} />

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
      
      <button className="updateProfileButton" onClick={handleUpdateProfile}>Update profile</button>
      <button className="deleteAccountButton">Delete account</button>
    </div>
    
  )
}

export default Settings;
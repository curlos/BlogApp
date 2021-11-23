import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  useHistory
} from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import { postImage } from "../../utils/postImage";
import './Settings.css';

const Settings = () => {
  
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()


  const [firstName, setFirstName] = useState(loggedInUser.firstName)
  const [lastName, setLastName] = useState(loggedInUser.lastName)
  const [email, setEmail] = useState(loggedInUser.email)
  const [password, setPassword] = useState(loggedInUser.password)
  const [aboutMe, setAboutMe] = useState(loggedInUser.aboutMe)
  // eslint-disable-next-line no-unused-vars
  const [profilePic, setProfilePic] = useState(loggedInUser.profilePic || null)
  const [file, setFile] = useState(null)
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0,0)
  }, [])

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

      try {
        const response = await postImage(file)
        body.profilePic = response.imagePath

        console.log(response)
      } catch (err) {
        console.log(err)
        return
      }
    }

    const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/users/user/update/${loggedInUser._id}`, body)

    console.log(response.data)
    setLoggedInUser(response.data)

    history.push(`/author/${loggedInUser._id}`)
  }

  console.log(loggedInUser)

  return (
    <div className="settingsContainer">
      <div className="settingsTitle"><h2>Account</h2></div>

      {(file || profilePic) && (
        <img className="profilePicImg" src={file ? URL.createObjectURL(file) : process.env.REACT_APP_SERVER_URL + profilePic } alt="f" />
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
      
      <div className="settingsButtons">
        <div>
          <button className="updateProfileButton" onClick={handleUpdateProfile}>Update profile</button>
        </div>
        <div>
          <button className="deleteAccountButton">Delete account</button>
        </div>
      </div>
    </div>
    
  )
}

export default Settings;
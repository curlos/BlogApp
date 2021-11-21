import axios from "axios";
import React, { useState } from "react";
import {
  Link,
  useHistory
} from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import './Header.css';

const Header = ({ setShowSidenav }) => {
  
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()
  const categories = ['TECH', 'LIFE', 'SPORTS', 'ART', 'FOOD', 'DIY', 'HEALTH', 'FITNESS']
  const [showDropdown, setShowDropdown] = useState(false)

  console.log(loggedInUser)

  const handleLogout = async () => {
    setShowDropdown(false)
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/logout`)
    setLoggedInUser({})
    localStorage.setItem('user', null)
    history.push('/')
  }

  return (
    <div>
      <div className="headerContainerTop">
        <div className="headerContainerTopLeft">

          {Object.keys(loggedInUser).length > 0 ? (
              <span>
                <span className="userDropdown" onClick={() => setShowDropdown(!showDropdown)}>
                  <span className="dropbtn">{loggedInUser.firstName} {loggedInUser.lastName}</span>
                  <i class="fas fa-chevron-down"></i>

                  {showDropdown ? (
                    <div class="userDropdown-content">
                      <Link to={`/author/${loggedInUser._id}`} onClick={() => setShowDropdown(false)}>My Profile</Link>
                      <Link to="/settings" onClick={() => setShowDropdown(false)}>Settings</Link>
                      <a href="/" onClick={handleLogout}>Log Out</a>
                    </div>
                  ) : null}
                </span>

              </span>
            ) : (
              <span className="userButtons">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </span>
            )}
        </div>

        <div className="mainTitle">
          <Link to="/">The Blog</Link>
        </div>

        <div className="userButtons">
          <Link to="/new-post">Write</Link>
        </div>

        <div className="sidebarButton">
          <i class="fas fa-bars" onClick={() => setShowSidenav(true)}></i>
        </div>
      </div>

      <div className="headerContainerBottom">
        {categories.map((category) => <Link to={`/posts?category=${category}`}>{category}</Link>)}

      </div>
    </div>
  )
}

export default Header;
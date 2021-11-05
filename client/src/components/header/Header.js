import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import './Header.css'
import UserContext from '../../contexts/UserContext'
import axios from "axios";

const Header = () => {
  
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()
  const categories = ['TECH', 'LIFE', 'SPORTS', 'ART', 'FOOD', 'DIY', 'HEALTH', 'FITNESS']

  console.log(loggedInUser)

  const handleLogout = async () => {
    await axios.get('http://localhost:8888/users/logout')
    setLoggedInUser({})
    history.push('/')
  }

  return (
    <div>
      <div className="headerContainerTop">
        <div className="headerContainerTopLeft">

          {Object.keys(loggedInUser).length > 0 ? (
              <span>
                <span className="dropdown">
                  <span className="dropbtn">{loggedInUser.firstName} {loggedInUser.lastName}</span>
                  <i class="fas fa-chevron-down"></i>

                  <div class="dropdown-content">
                    <Link to={`/author/${loggedInUser._id}`}>My Profile</Link>
                    <Link to="/settings">Settings</Link>
                    <a onClick={handleLogout}>Log Out</a>
                  </div>
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
      </div>

      <div className="headerContainerBottom">
        {categories.map((category) => <Link to={`/posts?category=${category}`}>{category}</Link>)}

      </div>
    </div>
  )
}

export default Header;
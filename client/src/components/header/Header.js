import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './Header.css'
import UserContext from '../../contexts/UserContext'
import axios from "axios";

const Header = () => {
  
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)

  console.log(loggedInUser)

  const handleLogout = async () => {
    await axios.get('http://localhost:8888/users/logout')
    setLoggedInUser({})
  }

  return (
    <div>
      <div className="headerContainerTop">
        <div className="searchButton">
          <i className="fas fa-search"></i>
        </div>

        <div className="mainTitle">
          <Link to="/">The Blog</Link>
        </div>

        <div className="userButtons">
          <button>
            <Link to="/new-post">Write</Link>
          </button>

          {Object.keys(loggedInUser).length > 0 ? (
            <span>
              <button onClick={handleLogout}>Logout</button>
              <span>{loggedInUser.firstName} {loggedInUser.lastName}</span>
            </span>
          ) : (
            <span>
              <button>
              <Link to="/login">Login</Link>
              </button>
              <button>
                <Link to="/register">Register</Link>
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="headerContainerBottom">
        <span>TECH</span>
        <span>LIFE</span>
        <span>SPORTS</span>
        <span>ART</span>
        <span>FOOD</span>
        <span>DIY</span>
        <span>HEALTH</span>
        <span>FITNESS</span>
      </div>
    </div>
  )
}

export default Header;
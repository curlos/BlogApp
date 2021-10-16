import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './Header.css'

const Header = () => {

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
          <button>
            <Link to="/login">Login</Link>
          </button>
          <button>
            <Link to="/register">Register</Link>
          </button>
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
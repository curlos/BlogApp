import React, { useState } from "react";
import {
  BrowserRouter as Router, Route, Switch,
} from "react-router-dom";
import { Redirect } from "react-router";
import './App.css';
import Header from './components/header/Header';
import Login from './components/login/Login';
import Post from './components/post/Post';
import Posts from './components/posts/Posts';
import PostForm from './components/post_form/PostForm';
import Register from './components/register/Register';
import Settings from './components/settings/Settings';
import UserProfile from './components/user_profile/UserProfile';
import UserContext from './contexts/UserContext';
import SidenavModal from "./components/sidenav_modal/SidenavModal";

function App() {

  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('user')) || {})
  const [showSidenav, setShowSidenav] = useState(false)

  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={{loggedInUser, setLoggedInUser}}>

          {showSidenav ? <SidenavModal showSidenav={showSidenav} setShowSidenav={setShowSidenav}/> : null}

          <Header setShowSidenav={setShowSidenav}/>

          <Switch>
            <Route path="/" exact>
              <Posts />
            </Route>

            <Route path="/posts" exact>
              <Posts />
            </Route>

            <Route path="/author/:id" exact>
              <UserProfile />
            </Route>

            <Route path="/new-post" exact>
              {Object.keys(loggedInUser).length < 1 ? <Redirect to="/login" /> : (
                <PostForm />
              )}
            </Route>

            <Route path="/edit-post/:id" exact>
              {Object.keys(loggedInUser).length < 1 ? <Redirect to="/login" /> : (
                <PostForm />
              )}
            </Route>

            <Route path="/post/:id" exact>
              <Post />
            </Route>

            <Route path="/login" exact>
              <Login />
            </Route>

            <Route path="/register" exact>
              <Register />
            </Route>

            <Route path="/settings" exact>
              {Object.keys(loggedInUser).length < 1 ? <Redirect to="/login" /> : (
                <Settings />
              )}
            </Route>
          </Switch>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;

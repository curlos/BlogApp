import React, { useState } from "react";
import {
  BrowserRouter as Router, Route, Switch
} from "react-router-dom";
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

function App() {

  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('user')) || {})

  console.log(loggedInUser)

  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={{loggedInUser, setLoggedInUser}}>
          <Header />

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
              <PostForm />
            </Route>

            <Route path="/edit-post/:id" exact>
              <PostForm />
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
              <Settings />
            </Route>
          </Switch>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;

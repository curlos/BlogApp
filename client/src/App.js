import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from './components/header/Header'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'
import PostForm from './components/post_form/PostForm'
import Login from './components/login/Login'
import Register from './components/register/Register'
import UserContext from './contexts/UserContext';
import UserProfile from './components/user_profile/UserProfile'
import './App.css';

function App() {

  const [loggedInUser, setLoggedInUser] = useState({})
  const [filters, setFilters] = useState({})

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
          </Switch>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;

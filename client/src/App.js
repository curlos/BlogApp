import React from "react";
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
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>

      <Header />

        <Switch>
          <Route path="/" exact>
            <Posts />
          </Route>

          <Route path="/new-post" exact>
            <PostForm />
          </Route>

          <Route path="/post/:id" exact>
            <Post />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

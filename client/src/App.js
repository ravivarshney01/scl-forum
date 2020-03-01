import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './App.css';
import 'react-quill/dist/quill.snow.css';
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from "./store";
import ProtactedRoute from './components/ProtactedRoute';
import Login from './views/Login';
import Signup from './views/Signup';
import Dashboard from './views/Posts';
import Post from './views/Post';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Profile from './views/Profile';

if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar></Navbar>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Signup} />
            <ProtactedRoute path="/posts" exact component={Dashboard} />
            <ProtactedRoute path="/posts/:id" component={Post} />
            <ProtactedRoute path="/profile/:username" component={Profile} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}


export default App;

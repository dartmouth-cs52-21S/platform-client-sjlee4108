import React from 'react';
import '../style.scss';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import Post from './post';
import dataTable from './dataTable';
import newPost from './newPost';
import EditPost from './editPost';
import LogIn from './LogIn';
import SignUp from './SignUp';
import PrivateRoute from './privateRoute';
import Nav from './nav';

const App = () => (
  <Router>
    <div id="appContainer">
      <Nav />
      <Switch>
        <Route exact path="/" component={dataTable} />
        <PrivateRoute path="/posts/new" component={newPost} />
        <PrivateRoute path="/posts/:postID/edit" component={EditPost} />
        <Route path="/posts/:postID" component={Post} />
        <Route path="/signin" component={LogIn} />
        <Route path="/signup" component={SignUp} />

        <Route render={() => (<div>post not found </div>)} />
      </Switch>
    </div>
  </Router>
);

export default App;

import React from 'react';
import '../style.scss';
import {
  BrowserRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { IconButton } from '@material-ui/core';
import Post from './post';
import dataTable from './dataTable';
import newPost from './newPost';
import EditPost from './editPost';

const App = () => (
  <Router>
    <div>
      <Nav />
      <Switch>
        <Route exact path="/" component={dataTable} />
        <Route path="/posts/new" component={newPost} />
        <Route path="/posts/:postID/edit" component={EditPost} />
        <Route path="/posts/:postID" component={Post} />
        <Route render={() => (<div>post not found </div>)} />
      </Switch>
    </div>
  </Router>
);

const Nav = () => (
  <nav>
    <ul>
      <li><NavLink exact to="/">LinkShare</NavLink></li>
      <li>
        <IconButton>
          <NavLink to="/posts/new">
            <NoteAddIcon />
          </NavLink>
        </IconButton>
      </li>
    </ul>
  </nav>
);

export default App;

import React from 'react';
import '../style.scss';
import {
  NavLink, withRouter,
} from 'react-router-dom';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { IconButton } from '@material-ui/core';
import { connect } from 'react-redux';

import { signoutUser } from '../actions';

const Nav = (props) => (
  <nav>
    <ul>
      <li id="homeLink"><NavLink exact to="/">LinkShare</NavLink></li>
      {props.auth
        ? (
          <li>
            <IconButton>
              <NavLink to="/posts/new">
                <NoteAddIcon />
              </NavLink>
            </IconButton>
          </li>
        ) : <li> <NavLink to="/signin">Sign In</NavLink></li>}

      {props.auth
        ? (
          <li><div role="button" tabIndex={0} onClick={() => { props.signoutUser(props.history); }}>Sign Out</div> </li>
        ) : <li> <NavLink to="/signup">Sign Up</NavLink></li>}
    </ul>
  </nav>
);

const mapStateToProps = (state) => (
  {
    auth: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { signoutUser })(Nav));

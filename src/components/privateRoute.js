import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

// Router Wrapper
const PrivateRoute = ({ component: Child, ...props }) => (
  <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    render={(routeProps) => (props.authenticated ? (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Child {...routeProps} />
    ) : (
      <Redirect to="/signin" />
    ))}
  />
);
const mapStateToProps = (state) => (
  {
    authenticated: state.auth.authenticated,
  }
);
export default withRouter(connect(mapStateToProps, null)(PrivateRoute));

import { makeStyles, TextField, Button } from '@material-ui/core';
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { signinUser } from '../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(0.9),
    },
  },
}));

const LogIn = (props) => {
  // eslint-disable-next-line react/static-property-placement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputValidate, setInputValidate] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const getAlertDialog = () => (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Log In Failed</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Invalid username and/or password. Please try again.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleChange = (e, type) => {
    if (type === 'email') {
      setEmail(e.target.value.replace(/\s/g, ''));
    } else if (type === 'password') {
      setPassword(e.target.value.replace(/\s/g, ''));
    }
  };

  const onCheckValidEmail = () => RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$').test(email);

  const onCheckValidPassword = () => {
    if (password.length < 8) {
      return false;
    }
    return true;
  };

  const onCheckInput = () => onCheckValidPassword() && onCheckValidEmail();

  const onClickSubmit = () => {
    if (onCheckInput()) {
      try {
        setInputValidate(false);
        setLoading(true);
        props.signinUser({ email, password }, props.history);
      } catch (error) {
        setOpen(true);
        setLoading(false);
      }
    } else {
      setInputValidate(true);
    }
  };

  return (
    <div id="logInContainer">
      <form className={classes.root} noValidate autoComplete="off">
        {getAlertDialog()}
        <div id="form">
          <div id="formTop">
            <h3>Welcome Back! Sign in here</h3>
          </div>
          <TextField
            required
            id="email_field"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => handleChange(e, 'email')}
            variant="filled"
            error={inputValidate && !onCheckValidEmail()}
            helperText={inputValidate && !onCheckValidEmail() ? 'Provide a valid email' : null}
            margin="dense"
            disabled={loading}
          />

          <TextField
            required
            id="password_field"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => handleChange(e, 'password')}
            variant="filled"
            error={inputValidate && !onCheckValidPassword()}
            helperText={inputValidate && !onCheckValidPassword() ? 'More than 8 characters' : null}
            margin="dense"
            disabled={loading}
          />
          <br />
          <Button disabled={loading} fullwidth="true" onClick={() => onClickSubmit()} variant="contained" color="primary">Sign In</Button>

        </div>
      </form>
    </div>
  );
};

// export default withRouter(connect(null, { createPost })(NewPost));
export default withRouter(connect(null, { signinUser })(LogIn));

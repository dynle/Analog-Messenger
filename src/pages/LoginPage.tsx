import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from '../assets/seal.png';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { authService, firebaseInstance } from '../fbase';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Analog Messenger Team
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appTitle: {
    alignItems: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontSize: 50,
    fontFamily: 'futura',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: 'linear-gradient(45deg, #9835FD 30%, #0EAED4 90%)',
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const onSocialLogin = async () => {
    let provider = new firebaseInstance.auth.GoogleAuthProvider();
    await authService.signInWithPopup(provider);
  };
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.appTitle}>Analog Messenger</div>
      <div className={classes.paper}>
        <img src={logo} alt="Logo" />
        <Typography component="h1" variant="h5">
          Live In The Moment
        </Typography>
        <Grid container>
          <GoogleLoginButton onClick={onSocialLogin} />
        </Grid>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

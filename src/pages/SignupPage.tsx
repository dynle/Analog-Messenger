import React, { ChangeEvent, useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { authService, firebaseInstance } from '../fbase';
import { addUser } from '../services/usernameService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countries } from '../assets/country';

interface CountryType {
  code: string;
  label: string;
  phone: string;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        Analog Messenger Team{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

//Doesn't support IE11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  option: {
    fontSize: 15,
    '& < span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
}));

export default function SignUp() {
  const [isCheckboxChecked, setCheckboxChecked] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const classes = useStyles();
  const userName = useRef<HTMLInputElement>();
  const userCountry = useRef<HTMLInputElement>();

  const onChangeCheckbox = (event: ChangeEvent<HTMLInputElement>, val: boolean) => {
    setCheckboxChecked(event.target.checked);
  };

  const alertClose = () => {
    setAlertOpen(false);
  }

  //When it's submitted
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //Check whether inputs are valid
    if (userName.current!.value === "" || userCountry.current!.value === "") {
      setAlertMessage("Input valid username or country.");
      setAlertOpen(true);
    }
    //Call addUser service and reload the page
    else if (isCheckboxChecked) {
      try {
        await addUser(userName.current!.value, userCountry.current!.value);
      } catch (err) {
        console.log(err)
      }
      window.location.reload();
    }
    //If a user hasn't agreed, show an alert
    else {
      setAlertMessage("Please, check the checkbox and agree to privacy policy of Analog Messenger before you sign up.");
      setAlertOpen(true);
    }
  };

  //Log in with different gmail
  const onSocialLogin = async () => {
    let provider = new firebaseInstance.auth.GoogleAuthProvider();
    await authService.signInWithPopup(provider);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Dialog
        open={alertOpen}
        onClose={alertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={alertClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                autoComplete="userName"
                inputRef={userName}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="country-select-demo"
                options={countries as CountryType[]}
                classes={{
                  option: classes.option,
                }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(option) => (
                  <React.Fragment>
                    <span>{countryToFlag(option.code)}</span>
                    {option.label} ({option.code}) +{option.phone}
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country *"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    inputRef={userCountry}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowPrivacy" color="primary" onChange={onChangeCheckbox}/>}
                label="I agree that analog messenger team can read your letters."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Typography variant="body2">
                <Link color="inherit" onClick={onSocialLogin}>
                  Already have an account? Sign in
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
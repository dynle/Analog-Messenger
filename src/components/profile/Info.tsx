import { makeStyles, IconButton,Box, Typography, TextField  } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import ProfilePhoto from './ProfilePhoto';
import { authService, db } from '../../fbase';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'center',
      marginTop:'5%'
    },
    info: {
      paddingTop: '10%',
      width: '20rem',
    },
    infos: {
      flexDirection:'column',
      marginLeft:'7%',
    },
  };
});

export default function Info() {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [country, setCountry] = useState("");
  const uid = authService.currentUser!.uid;

  useEffect(() => {
    const fetch = async () => {
      const _userName = (await db.doc(`users/${uid}`).get()).data()!.userName;
      const _country = (await db.doc(`users/${uid}`).get()).data()!.timezone;
      setUserName(_userName);
      setCountry(_country);
    };
    fetch();
  }, []);

  return (
    <Box className={classes.root}>
      <ProfilePhoto />
      <Box className={classes.infos}>
        <Box className={classes.info}>
          <Typography>Name</Typography>
          <TextField 
            InputProps={{ readOnly: true }}
            value={userName}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box className={classes.info}>
          <Typography>Country</Typography>
          <TextField
            InputProps={{ readOnly: true }}
            value={country}
            variant="outlined"
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}

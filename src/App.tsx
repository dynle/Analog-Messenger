import React, { useState, useEffect } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { authService, db } from './fbase';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#9a67ea',
      main: '#673ab7',
      dark: '#320b86',
      contrastText: '#fff',
    },
  },
});


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDocExist, setIsDocExist] = useState(false);
  
  useEffect(() => {
    console.log("inside useEffect");
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
      }
      //If a user logged in
      if (isLoggedIn) {
        //Check if that user has his own doc in firestore
        if (authService.currentUser) {
          const uid = authService.currentUser.uid;
          console.log(uid);
          const uidDoc = await db.collection(`users`).doc(`${uid}`).get();
          if (!uidDoc.exists) {
            console.log("NOT FOUND");
            setIsDocExist(false);
          }
          else {
            console.log("FOUND");
            setIsDocExist(true);
          }
        }
      }
    });
    return unsubscribe;
  }, [isLoggedIn]);
  
  //If a user logged in but does not have a doc, render SignupPage
  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {isLoggedIn ? ( isDocExist ? <MainPage /> : <SignupPage/> ) : <LoginPage />}
      </MuiThemeProvider>
    </React.Fragment>
  );
}

export default App;

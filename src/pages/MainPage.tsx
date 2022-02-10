import React, { createContext, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Inbox from '../components/inbox/Inbox';
import Profile from '../components/profile/Profile';
import LockedPage from './LockedPage';
import NavigationBar from '../components/NavigationBar'
import { Grid } from '@mui/material';

export const MainPageContext = createContext<any>({});

export default function MainPage() {
  const [navToggle, setNavToggle] = useState(true);
  

  return (
    <MainPageContext.Provider value={{navToggle, setNavToggle}}>
      <Grid container spacing={1}>
        <Grid item>
          <NavigationBar />
        </Grid>
        <Grid item style={{width: 'calc(100% - 100px)', height: '100%'}}>
          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/locked">
              <LockedPage/>
            </Route>
            <Route path="/writing">
              <Inbox writeMode={true}/>
            </Route>
            <Route path="/">
              <Inbox writeMode={false}/>
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </MainPageContext.Provider>
  );
}

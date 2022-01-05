import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/styles';
import {
  Link,
} from "react-router-dom";
import { MainPageContext } from '../pages/MainPage';

const drawerWidth = 81;
const useStyles = makeStyles({
  paper: {
    justifyContent: 'center',
    width:'100px'
  },
  listitem: {
    minWidth: '0px',
    paddingBottom: '5px',
    paddingTop: '5px'
  },
  icons: {
    width: '2em',
    height: '2em',
  },
  button: {
    justifyContent: 'center'
  }
})

export default function NewNavigationBar() {
  const classes = useStyles()
  const { navToggle } = useContext(MainPageContext);
  return (
      <Drawer
        classes = {{paper: classes.paper}}
        style={{
          width: drawerWidth,
          flexShrink: 0,
        }}
        variant="persistent"
        anchor="left"
        open={navToggle}
      >
        <List>
          <Link to="/">
            <ListItem button={true} classes = {{root: classes.button}}>
              <ListItemIcon classes = {{root: classes.listitem}}>
                <EmailIcon classes = {{root: classes.icons}}/>
              </ListItemIcon>
            </ListItem>
          </Link>
          <Link to='/locked'>
            <ListItem button={true} classes = {{root: classes.button}}>
              <ListItemIcon classes = {{root: classes.listitem}}>
                <LockIcon classes = {{root: classes.icons}}/>
              </ListItemIcon>
            </ListItem>
          </Link>
          <Link to='/writing'>
            <ListItem button={true} classes = {{root: classes.button}}>
              <ListItemIcon classes = {{root: classes.listitem}}>
                <CreateIcon classes = {{root: classes.icons}}/>
              </ListItemIcon>
            </ListItem>
          </Link>
          <Link to='/profile'>
            <ListItem button={true} classes = {{root: classes.button}}>
              <ListItemIcon classes = {{root: classes.listitem}}>
                <SettingsIcon classes = {{root: classes.icons}}/>
              </ListItemIcon>
            </ListItem>
          </Link>
        </List>
      </Drawer>
  );
}
import React from 'react';
import { Avatar, Box, Card, makeStyles, Typography } from '@material-ui/core';
import LockIcon from "@material-ui/icons/Lock";


const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
    },
  };
});

export default function LockCard(props: {sender:string}) {
  const classes = useStyles();

  return (
    <Card elevation={0} className={classes.root}>
    <Avatar style={{width:70, height:70}}>
                  <LockIcon fontSize="large"></LockIcon>
    </Avatar>
    <Box width={20} />
    <Box>
      <Typography variant="h5">LOCKED</Typography>
      <Typography variant="subtitle1">{props.sender}</Typography>
    </Box>
    </Card>
  );
}

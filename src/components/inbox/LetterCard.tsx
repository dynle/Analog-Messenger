import React from 'react';
import { Avatar, Box, Card, makeStyles, Typography } from '@material-ui/core';
import { LetterCardProps } from './Inbox';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
    },
    avatar: {
      width: 70,
      height: 70,
    },
  };
});

export default function LetterCard(props: LetterCardProps) {
  const classes = useStyles();
  return (
    <Card elevation={0} className={classes.root}>
      <Avatar src={props.src} className={classes.avatar} />
      <Box width={20} />
      <Box flexGrow="1">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">{props.title}</Typography>
        </Box>
        <Typography variant="subtitle1">{props.subTitle}</Typography>
      </Box>
    </Card>
  );
}

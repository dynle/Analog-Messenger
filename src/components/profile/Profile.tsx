import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { Box, Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import FriendRequestList from './FriendRequestList';
import FriendList from './FriendList';
import { authService } from '../../fbase';
import Info from './Info';
import { FriendRequest } from '../../entities/friendRequest';
import {
  onSnapshotFriendRequests,
  onSnapshotFriends,
} from '../../services/friendsService';
import { Friend } from '../../entities/friend';

const useStyles = makeStyles((theme) => {
  return {
    friends: {
      display: 'flex',
      justifyContent: 'space-evenly',
      paddingTop: "4%",
    },
  };
});

export default function Profile() {
  const classes = useStyles();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const unsubRequests = onSnapshotFriendRequests(setRequests);
    return unsubRequests;
  }, []);

  useEffect(() => {
    const unsubFriends = onSnapshotFriends(setFriends);
    return unsubFriends;
  }, []);

  return (
    <Box>
      <Container>
        <Info />
        <Box className={classes.friends}>
          <FriendList friends={friends}/>
          <FriendRequestList
            requests={requests}
          />
        </Box>
      </Container>
    </Box>
  );
}

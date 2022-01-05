import {
  List,
  ListItem,
  makeStyles,
  Typography,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { Box, Card } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import React, { useEffect, useRef, useState } from 'react';
import { Friend } from '../../entities/friend';
import DeleteIcon from '@material-ui/icons/Delete';
import { Autocomplete } from '@material-ui/lab';
import { authService, db } from '../../fbase';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      padding: 20,
      height: 320,
      overflow: 'auto',
      width: '45%',
    },
    noFriends: {
      height: '50%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});

export default function FriendList(props: { friends: Friend[]}) {
  let history = useHistory();
  const classes = useStyles();
  const userName = useRef<HTMLInputElement>();
  const [dialog, setDialogOpen] = useState(false);
  const [friends,setFriends] = useState<any>([]);
  const [avatarUrls, setAvatarUrls] = useState<any>([]);
  console.log(props.friends);
  useEffect(() => {
    const fetchAvatarUrls = async () => {
      const urls = await Promise.all(props.friends.map(async (friend) => {
        return await (await db.doc(`users/${friend.id}`).get()).data()!.avatarUrl;
      }));
      setAvatarUrls(urls);
    }
    //If friends exist, fetch each friend's avatarUrl
    if (props.friends.length !== 0) {
      fetchAvatarUrls();
    }
    else {
      console.log("no friends detected");
    }
  }, [props.friends])

  const dialogClose = () => {
    setDialogOpen(false);
  };

  const dialogOpen = async () => {
    setFriends(props.friends);
    setDialogOpen(true);
  };

  const onDeleteFriend = async () => {
    for (var i=0;i<friends.length;i++){
      if (friends[i].userName == userName.current!.value){
        const myId = authService.currentUser!.uid;
        const friendId = friends[i].id;
        await db.collection("users").doc(`${myId}`).collection("friends").doc(`${friendId}`).delete().then(()=>{
          console.log("successfully deleted from my friend list");
        }).catch((error)=>console.log(error));
        await db.collection("users").doc(`${friendId}`).collection("friends").doc(`${myId}`).delete().then(()=>{
          console.log("successfully deleted from your friend's list");
        }).catch((error)=>console.log(error));
      }
    }
    setDialogOpen(false);
    history.push("/profile");
  }

  
  return (
    <>
    <Dialog
        open={dialog}
        onClose={dialogClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{"Search users"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Search a user you want to delete and click delete button.
          </DialogContentText>
          <Autocomplete
            id="combo-box-demo"
            options={ friends }
            getOptionLabel={(option:any) => option.userName}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Users  " variant="outlined" inputRef={userName}/>}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteFriend} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
    </Dialog>
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{variant: 'h6'}}
        title="Friends"
        action={
          <IconButton edge="end" aria-label="delete" onClick={dialogOpen}>
            <DeleteIcon />
          </IconButton>
        }
      >
      </CardHeader>
      {props.friends.length === 0 ? (
        <Box className={classes.noFriends}>
          <Typography variant="h6">No Friends</Typography>
        </Box>
      ) : (
        <List>
          {
            props.friends.map((friend, index) => {
            return (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={avatarUrls[index]} />
                </ListItemAvatar>
                <ListItemText>{friend.userName}</ListItemText>
              </ListItem>
            );
          })}
        </List>
        )}
    </Card>
  </>
  );
}

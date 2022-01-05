import {
  List,
  ListItem,
  makeStyles,
  Typography,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
} from '@material-ui/core';
import { Box, Card } from '@material-ui/core';
import { Check, Clear } from '@material-ui/icons';
import React, { Fragment, useState, useRef, useEffect } from 'react';
import { FriendRequest } from '../../entities/friendRequest';
import AddIcon from '@material-ui/icons/Add';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { 
  acceptFriendRequest,
  checkFriendExist,
  denyFriendRequest,
  onSnapshotUsers,
} from '../../services/friendsService';
import { User } from "../../entities/user";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      padding: 20,
      height: 320,
      overflow: 'auto',
      width: '45%',
    },
    check: {
      color: 'green',
    },
    noRequests: {
      height: '50%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});

export default function FriendRequestList(props: {
  requests: FriendRequest[];
}) {
  const classes = useStyles();
  const userName = useRef<HTMLInputElement>();
  const [dialog, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const dialogClose = () => {
    setDialogOpen(false);
  };
  const dialogOpen = () => {
    setDialogOpen(true);
  }
  const sendRequest = async () => {
    await checkFriendExist(userName.current!.value);
    setDialogOpen(false);
  };

  useEffect(()=>{
    const unsubUsers = onSnapshotUsers(setUsers);
    return unsubUsers;
  },[props.requests])

  return (
    <Fragment>
    <Dialog
        open={dialog}
        onClose={dialogClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{"Search users"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Please search users and click send button.
          </DialogContentText>
          <Autocomplete
            id="combo-box-demo"
            options={ users }
            getOptionLabel={(option) => option.userName}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Users  " variant="outlined" inputRef={userName}/>}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={sendRequest} color="primary" autoFocus>
            Send
          </Button>
        </DialogActions>
    </Dialog>
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{variant: 'h6'}}
        title="Friend Requests"
        action={
          <IconButton edge="end" aria-label="add" onClick={dialogOpen}>
            <AddIcon/>
          </IconButton>
        }
      >
      </CardHeader>
      {props.requests.length === 0 ? (
        <Box className={classes.noRequests}>
          <Typography variant="h6">No Friend Requests</Typography>
        </Box>
      ) : (
        <List>
          {props.requests.map((request, index) => {
            return (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={request.avatarUrl} />
                </ListItemAvatar>
                <ListItemText>{request.senderName}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={async () => {
                      await acceptFriendRequest(request);
                    }}
                    >
                    <Check className={classes.check} />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      await denyFriendRequest(request);
                    }}
                    >
                    <Clear color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </Card>
    </Fragment>
  );
}

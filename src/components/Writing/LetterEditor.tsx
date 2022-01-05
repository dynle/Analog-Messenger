import {
  Box,
  IconButton,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEvent, Fragment, useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendMessage } from '../../services/messageService';
import { Friend } from "../../entities/friend";
import { useEffect } from 'react';
import { onSnapshotFriends } from '../../services/friendsService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

// Check invalid input, Check time slider error
export default function LetterEditor() {
  const [time, setTime] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const title = useRef<HTMLInputElement>();
  const body = useRef<HTMLInputElement>();
  const receiver = useRef<HTMLInputElement>();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendId, setFriendId] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const alertClose = () => {
    setAlertOpen(false);
  }

  useEffect(() => {
    const unsubFriends = onSnapshotFriends(setFriends);
    return unsubFriends;
  }, []);

  const onTimeChange = useCallback(
    (event: ChangeEvent<{}>, val: number | number[]) => {
      setTime(val as number);
      setHour(Math.floor(val as number/60));
      setMinute(val as number%60);
    },
    []
  );

  const history = useHistory();

  const onSend = useCallback(
    async (event: any) => {
      const date = new Date();
      date.setHours(date.getHours() + hour);
      date.setMinutes(date.getMinutes() + minute);
      const data = {
        title: title.current!.value,
        body: body.current!.value,
        deliverTime: date,
      };
      if (friendId === "") {
        setAlertOpen(true);
        return;
      }
      await sendMessage(data, friendId);
      history.push('/');
    },
    [friendId, time, history]
  );

  return (
  <div style={{width: '90%'}}>
    <Dialog
      open={alertOpen}
      onClose={alertClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">{"Alert"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          No receiver's name.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={alertClose} color="inherit" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
    
    <Box>
      <Box display="flex">
        <Typography variant="h6" style={{alignSelf:'center'}}>Time</Typography>
        <Box flexGrow="1">
          <Typography variant="h6" align="center">
            {hour} hours <br/> {minute} minutes
          </Typography>
        </Box>
        <Tooltip title="Send" placement="top" arrow>
          <IconButton onClick={onSend}>
            <Send />
          </IconButton>
        </Tooltip>
      </Box>
      <Box height="10px" />
      <Slider
        onChange={onTimeChange}
        max={720}
        min={0}
        defaultValue={1}
      />
      <Box height="10px" />
        <Autocomplete
          id="combo-box-demo"
          options={ friends }
          getOptionLabel={(option) => option.userName}
          fullWidth
          onChange={(event,value) => {
            if (value != null) setFriendId(value!.id)
          }}
          renderInput={(params) => <TextField {...params} label="Send to  " variant="outlined" inputRef={receiver}/>}
        />
      <Box height="20px" />
      <TextField label="Title" variant="outlined" fullWidth inputRef={title} />
      <Box height="20px" />
      <TextField
        label="Message"
        multiline
        rowsMax={30}
        variant="outlined"
        fullWidth
        rows={17}
        inputRef={body}
      />
    </Box>
  </div>
  );
}

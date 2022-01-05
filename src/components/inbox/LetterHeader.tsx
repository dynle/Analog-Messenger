import { Avatar, Box, Typography } from '@material-ui/core';
import React from 'react';
import inboxData from '../../data/inbox.json';

export default function LetterHeader() {
  return (
    <Box pl={4} pr={6} display="flex">
      <Avatar
        src={inboxData[0].avatarSrc}
        style={{
          width: 72,
          height: 72,
        }}
      />
      <Box width={24} />
      <Box flexGrow={1}>
        <Typography variant="h6">Ali Corner</Typography>
        <Typography variant="h4">Where is my donut ?</Typography>
      </Box>
      <Typography variant="body2">1 hour ago</Typography>
    </Box>
  );
}

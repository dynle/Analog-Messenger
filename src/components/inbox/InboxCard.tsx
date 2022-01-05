import { Avatar, Box, Card, CardContent, CardHeader, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  timeDisplay: {
    margin: "0 0"
  }
}));

type InboxCardProps = {
  avatarSrc?: string
  sender: string
  subheader?: string
  body: string
}

export default function InboxCard(props: InboxCardProps) {
  const classes = useStyles();

  return (
    <Box py={2}>
      <Card>
        <CardHeader avatar={
          <Avatar src={props.avatarSrc} />
        }
        title={props.sender}
        subheader={props.subheader}
        classes={{action: classes.timeDisplay}} />
        <Box pl={1}>
          <CardContent>
            <Typography variant="body2">
              {props.body}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  )
}
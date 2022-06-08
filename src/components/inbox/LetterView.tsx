import React, { useEffect } from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import LetterToolbar from "./LetterToolbar";
import { Letter } from "../../entities/letter";
import Timer from "../timer/Timer";
import { db, authService } from "../../fbase";

export default function LetterView(props: {
    letter: Letter[];
    opened: boolean;
    letterClickedHandler: any;
}) 
{
  console.log(props.letter);
  let docId = props.letter[1];
  let deliveryTime = props.letter[0].deliverTime.seconds;
  let deliveryDate = new Date(deliveryTime*1000).toLocaleString();
  let opened = props.opened;
  let currDoc = db.collection("users").doc(`${authService.currentUser!.uid}`).collection("inbox").doc(`${docId}`);

  return (
    <div>
      {opened ? (
        <Box width="90%">
          <LetterToolbar letterClickedHandler={props.letterClickedHandler} currDoc={currDoc}/>
          <Box height={16} />
            <Box pl={4} pr={6}>
              <Typography variant="h3">{props.letter[0].title}</Typography>
            </Box>
            <Box height={16} />
            <Divider variant="middle" />
            <Box p={1} display="flex">
              <Box p={1} flexGrow={1}>
                <Avatar
                    src={props.letter[2].avatarUrl}
                    style={{
                        width: 72,
                        height: 72,
                    }}
                />
              </Box>
              <Box p={1} flexGrow={50}>
                <Typography variant="subtitle1">
                  {props.letter[0].sender}
                </Typography>
              </Box>
              <Box p={1} flexGrow={1}>
                  <Typography variant="subtitle1">{deliveryDate}</Typography>
              </Box>
            </Box>
            {/* LetterBody */}
            <Box height={20} />
            <Box
                pl={10}
                pr={10}
                pt={10}
                pb="10em"
                style={{ backgroundColor: "#1F242F" }}
                justifyContent="center"
            >
            <Typography
                variant="body1"
                style={{ wordWrap: "break-word" }}
            >
              {props.letter[0].body}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Timer
          deliveryTime={deliveryTime}
          docRef={currDoc}
        ></Timer>
      )}
    </div>
  );
}

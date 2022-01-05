import { AppBar, IconButton, Toolbar } from '@material-ui/core'
import { DeleteOutline, Reply, StarOutline } from '@material-ui/icons'
import { Letter } from "../../entities/letter";

import React from 'react'


export default function LetterToolbar(props:{currDoc:any; letterClickedHandler:any}) {
  const onDeleteLetter = () => {
    console.log("clicked");
    props.currDoc.delete().then(()=>{
      console.log("letter deleted");
      props.letterClickedHandler([]);
    }).catch((error:any)=>{
      console.log(error);
    })
  }
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar style={{paddingLeft: 32, paddingRight: 48}}>
        <IconButton onClick={onDeleteLetter}>
          <DeleteOutline />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

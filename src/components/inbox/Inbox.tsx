import React, { useState, useEffect, Fragment } from 'react';
import { ListItem } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import LetterView from './LetterView';
import { Letter } from '../../entities/letter';
import { onSnapshotMyMessages } from '../../services/messageService';
import LetterEditor from '../Writing/LetterEditor';
import { FixedSizeList , ListChildComponentProps } from 'react-window';
import { ListItemButton } from '@mui/material';
import LetterCard from './LetterCard';
import LockCard from './LockCard';
import { useHistory } from "react-router-dom";

export type LetterCardProps = {
  src?: string;
  title: string;
  subTitle: string;
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 0,
    display: "flex",
  },
  itemFlexGrow: {
    flexGrow: 1,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  default: {
    textAlign: 'center',
    opacity: 0.33,
    fontFamily: 'futura',
    fontSize: 50,
    textTransform: 'uppercase',
  }
}));

export default function Inbox(props: {writeMode: boolean}) {
  const [letters, setLetters] = useState<(Letter)[][]>([]);
  const [letterClicked, setLetterClicked] = useState<(Letter)[]>([]);
  const [opened,setOpened] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const classes = useStyles();
  const history = useHistory();

  const handleLetterClicked = (index: number, opened: boolean) => {
    setLetterClicked(letters[index]);
    setOpened(opened);
    history.push("/");
  };
  
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    var unsubLetters = onSnapshotMyMessages(setLetters);
    return () => {
      unsubLetters();
    }
  }, []);
  
  function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    return (
      <ListItem style={style} key={index} component="div"  disablePadding>
        <ListItemButton onClick={()=>{handleLetterClicked(index, data[index][0].opened)}}>
          {data[index][0].opened ? (
            <LetterCard 
              src={data[index][2]}
              title={data[index][0].title}
              subTitle={data[index][0].sender}
            />
          ) : (
            <LockCard sender={data[index][0].sender}/>
          )}
        </ListItemButton>
      </ListItem>
    )
  };

  return (
    <Fragment>
      <div className={classes.container}>
        <FixedSizeList
          height={windowDimensions.height}
          width={360}
          itemSize={100}
          itemData={letters}
          itemCount={letters.length}
          overscanCount={5}
        >
        {renderRow}
        </FixedSizeList>
        <div className={classes.itemFlexGrow}>
          {props.writeMode ? (
            <LetterEditor></LetterEditor>
          ) : ( 
            <div style={{width:'100%'}}>
              {letterClicked.length === 0 ? (
                <div className={classes.default}>No letter selected</div>
              ) : (
                <LetterView letter={letterClicked} opened={opened} letterClickedHandler={setLetterClicked}/>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    Divider,
    makeStyles,
} from "@material-ui/core";
import { db, storage } from "../../fbase";
import PersonIcon from "@material-ui/icons/Person";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { authService } from "../../fbase";
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    profilePhoto: {
        width: "200px",
        height: "200px",
        borderRadius: "50%",
    },
    noProfilePhoto: {
        backgroundColor: "#D4D4D4",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
    },
    uploadLoading: {
        width: "200px",
        height: "200px",
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    boxStyle: {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
    },
    signOutButton: {
        marginTop: "5%",
    },
}));

export default function ProfilePhoto() {
    const classes = useStyles();
    const [currentProfilePhoto, setCurrentProfilePhoto] = useState<string | undefined>("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const uid = authService.currentUser!.uid;
    const storageRef = storage.ref(`user_avatars`);
    const docRef = db.collection("users").doc(`${uid}`);

    let history = useHistory();

    // open a dialog
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    // close a dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    const onSignOut = async () => {
        await authService.signOut();
        history.push("/");
        window.location.reload();
    };

    // fetch currentProfilePhoto from avatarUrl in firestore
    const fetchPhoto = () => {
        var url;
        docRef.get().then((doc) => {
            if (doc.exists) {
                url = doc.data()!.avatarUrl;
                setCurrentProfilePhoto(url);
                setUploadLoading(curr=>!curr);
                console.log("file existed");
            } else {
                console.log("No Doc");
            }
        });
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        handleDialogClose();
        setUploadLoading(curr=>!curr);
        setCurrentProfilePhoto("");

        // upload the photo to firebase storage
        const fileInput = e.target.files[0];
        const fileRef = storageRef.child(`${uid}`);
        await fileRef.put(fileInput).then(() => {
            console.log("Uploaded a file");
        });

        // get the url of the photo to display on the screen
        const url = await fileRef.getDownloadURL();
        docRef.update({
            avatarUrl: url,
        });
        setCurrentProfilePhoto(url);
        setUploadLoading(curr=>!curr);
    };

    const onDelete = async () => {
        storageRef
            .child(`${uid}`)
            .delete()
            .then(() => {
                console.log("Deleted a file");
            }).catch((e)=>console.log("No profile photo"))
        let url = await storageRef.child(`default.png`).getDownloadURL();
        docRef.update({
            avatarUrl: `${url}`,
        });
        setCurrentProfilePhoto(url);
        handleDialogClose();
    };

    // dialog component
    function PhotoSettingDialog(props: {open:boolean,onClose:()=>void}) {
        const { onClose, open } = props;
        const handleDialogClose = () => {
            onClose();
        };
    
        return (
            <Dialog onClose={handleDialogClose} open={open} maxWidth="xs" fullWidth={true} style={{textAlign:'center'}}>
                <DialogTitle>Change Profile Photo</DialogTitle>
                <Divider/>
                <label htmlFor="contained-button-file" style={{textAlign:'center',marginBottom:0}}>
                    <input accept="image/*" id="contained-button-file" style={{display:'none'}} type="file" onChange={onSubmit} />
                    <Button component="span" style={{width:'100%', color:'#0095F6'}}>
                        Upload Photo
                    </Button>
                </label>
                <Divider/>
                <Button onClick={onDelete} style={{color:'#ED4956'}}>Remove Current Photo</Button>
                <Divider/>
                <Button onClick={handleDialogClose}>Cancel</Button>
            </Dialog>
        );
    }

    useEffect(() => {
        fetchPhoto();
    }, []);

    return (
        <Box className={classes.boxStyle}>
            {uploadLoading ? (
                <div className={classes.uploadLoading}>
                    <CircularProgress />
                </div>
            ) : (
                <img
                    src={currentProfilePhoto}
                    className={classes.profilePhoto}
                    style={{background:'#D1D4D8'}}
                ></img>
            )}
            <br/>
            <Button
                variant="outlined"
                onClick={() => {
                    if (uploadLoading){
                        handleSnackbarOpen();
                    }
                    else handleDialogOpen();
                }}
            >
                Change Profile Photo
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                onClick={onSignOut}
                className={classes.signOutButton}
            >
                Sign out
            </Button>
            <PhotoSettingDialog open={dialogOpen} onClose={handleDialogClose} />
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                autoHideDuration={3000}
                open={snackbarOpen}
                onClose={handleSnackbarClose}
            >
                <Alert severity="error">Please wait</Alert>
            </Snackbar>
        </Box>
    );
}
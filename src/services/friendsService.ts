import firebase from 'firebase';
import {authService, db} from '../fbase';
import {
  friendRequesConverter,
  FriendRequest,
} from '../entities/friendRequest';
import { friendConverter } from '../entities/friend';
import { User } from '../entities/user';

export function onSnapshotUsers(setUsers:any) {
  const uid = authService.currentUser!.uid;
  const colRef = db.collection('users/');
  let data:any=[];
  //Exclude current user && firebase manager document
  var onSnapshotListener = colRef
  .where(firebase.firestore.FieldPath.documentId(), 'not-in', [`${uid}`, 'qa0IkNpobLmYdxhTNBE8'])
  .onSnapshot((snapshot)=>{
    data = snapshot.docs.map((doc)=>doc.data());
    console.log(data);
    setUsers(data);
  });
  return onSnapshotListener;
}

export function onSnapshotFriends(setFriends:any) {
  const uid = authService.currentUser!.uid;
  const colRef = db.collection(`users/${uid}/friends`);
  var onSnapshotListener = colRef.withConverter(friendConverter).onSnapshot((snapshot)=>{
    let data:any=[];
    //Get friend collection's data
    data = snapshot.docs.map((doc)=>{
      return doc.data();
    });
    if (data.length !== 0) {
      console.log("Friends:", data);
      setFriends(data);
    } else {
      setFriends([]);
    }
  })
  return onSnapshotListener
}

export async function checkFriendExist (destination: string) {
  const uid = authService.currentUser!.uid;
  await db.collection(`users/${uid}/friends`).where('userName','==',`${destination}`)
  .get()
  .then((querySnapshot) => {
    //If not friend, send a request
    if (querySnapshot.empty) {
      sendFriendRequest(destination);
    }
    //If already friend, do nothing
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        console.log("already exists");
        return;
      }
    })
  })
}

export async function sendFriendRequest(destination: string) {
  const uid = authService.currentUser!.uid;
  const profile = await db.doc(`users/${uid}`).get();
  const {userName} = profile.data() as User;
  //friend_request doc uid is same as users' uid so it won't be redundant
  await db
    .collection('users/').where('userName','==',`${destination}`)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const colRef = doc.id;
        db.collection(`users/${colRef}/friend_requests`).doc(`${uid}`).set({ sender: uid, senderName: userName });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

export function onSnapshotFriendRequests(setRequests:any,amount: number = 15) {
  const uid = authService.currentUser!.uid;
  const colRef = db.collection(`users/${uid}/friend_requests`);
  let data:any=[];
  var onSnapshotListener = colRef.withConverter(friendRequesConverter).onSnapshot((snapshot)=>{
    data = snapshot.docs.map((doc)=>doc.data());
    if (data.length !== 0) {
      setRequests(data);
    } else {
      setRequests([]);
    }
  })
  return onSnapshotListener
}

export async function acceptFriendRequest(request: FriendRequest) {
  const uid = authService.currentUser!.uid;
  const profile = await db.doc(`users/${uid}`).get();
  const {userName} = profile.data() as User;
  const friend_Ref = db
    .doc(`users/${request.sender}/friends/${uid}`);
  const requestRef = db
    .doc(`users/${uid}/friend_requests/${request.id}`);
  const myFriendRef = db
    .doc(`users/${uid}/friends/${request.sender}`);
  const batch = db.batch();
  batch.delete(requestRef);
  batch.set(myFriendRef, {
    userName: request.senderName,
  });
  batch.set(friend_Ref, {
    userName: userName,
  });
  await batch.commit();
}

export async function denyFriendRequest(request: FriendRequest) {
  const uid = authService.currentUser!.uid;
  const requestRef = db
    .doc(`users/${uid}/friend_requests/${request.id}`);
  await requestRef.delete();
}
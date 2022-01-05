import firebase from 'firebase';
import { db } from '../fbase';

export type Friend = {
  id: string;
  userName: string;
  avatarUrl?: any;
};

//DONT MIX USE SNAPSHOT AND GET METHOD, NEED TO BE FIXED
// async function getAvatarUrl(id:string) {
//   let friendDoc = await db.doc(`users/${id}`).get();
//   return friendDoc.data()!.avatarUrl;
// }

export const friendConverter = {
  toFirestore(request: Friend): firebase.firestore.DocumentData {
    return {
      userName: request.userName,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
    ): Friend {
    const data = snapshot.data();
    // let _avatarUrl = getAvatarUrl(snapshot.id);
    return {
      userName: data.userName,
      id: snapshot.id,
    };
  },
};
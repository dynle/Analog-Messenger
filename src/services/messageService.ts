import { authService, db } from '../fbase';
import { Letter } from '../entities/letter';
import { User } from '../entities/user';

export const fetchMyMessages = async (amount: number = 50) => {
  const uid = authService.currentUser!.uid;
  const colRef = db.collection(`users/${uid}/inbox`);
  const snapshot = await colRef.limit(amount).get();
  return snapshot.docs.map((doc) => [doc.data() as Letter,doc.id]);
};

export const onSnapshotMyMessages = (setLetters:any) => {
  const uid = authService.currentUser!.uid;
  const colRef = db.collection(`users/${uid}/inbox`);
  var onSnapshotListener = colRef.onSnapshot(async(snapshot)=>{
    const data = await Promise.all(
      snapshot.docs.map(async (doc) => {
        let url;
        let senderUID = doc.data()!.senderUID;
        let userRef = db.collection(`users`).doc(`${senderUID}`);
        await userRef.get().then((doc)=>{
          if(doc.exists){
            url = doc.data()!.avatarUrl;
          } 
        })
        return [doc.data() as Letter, doc.id, url];
      })
    );
    setLetters(data);
  })
  return onSnapshotListener
}

export const sendMessage = async (
  letter: { title: string; body: string; deliverTime: Date },
  receiverId: string
) => {
  const uid = authService.currentUser?.uid;
  const colRef = db.collection(`users/${receiverId}/inbox`);
  const docRef = db.doc(`users/${uid}`);
  const doc = await docRef.get();
  await colRef.add({
    sender: (doc.data() as User).userName,
    opened: false,
    senderUID: uid,
    ...letter,
  });
};

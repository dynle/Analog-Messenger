import { firebaseInstance, authService, db } from '../fbase';

export const addUser = async (userName: string, userCountry: string) => {
  const uid = authService.currentUser!.uid;
  const currentTime = firebaseInstance.firestore.FieldValue.serverTimestamp();
  await db
    .collection('users')
    .doc(`${uid}`)
    .set({
      userName: userName,
      avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/analog-messenger.appspot.com/o/user_avatars%2Fdefault.png?alt=media&token=5574a227-19d2-4b3e-8d00-0806b73e6fba',
      timezone: userCountry,
    })
    .catch((error) => {
      console.error('Failed to create user document: ', error);
    });
  await db
    .collection('users')
    .doc(`${uid}`)
    .collection('inbox')
    .add({
      deliverTime: currentTime,
      opened: true,
      sender: 'Analog Messenger Team',
      title: 'Welcome!',
      body: "Welcome! We're so glad that you signed up! Now we're going to read all your letters! NICE!",
      senderUID: "qa0IkNpobLmYdxhTNBE8"
    })
    .catch((error) => {
      console.error('Failed to create inbox collection: ', error);
    });
};

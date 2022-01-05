import firebase from 'firebase';

export type FriendRequest = {
  sender: string;
  avatarUrl: string;
  senderName: string;
  id: string;
};

export const friendRequesConverter = {
  toFirestore(request: FriendRequest): firebase.firestore.DocumentData {
    return {
      sender: request.sender,
      avatarUrl: request.avatarUrl,
      senderName: request.senderName,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): FriendRequest {
    const data = snapshot.data();
    return {
      sender: data.sender,
      avatarUrl: data.avatarUrl,
      senderName: data.senderName,
      id: snapshot.id,
    };
  },
};

import { User } from './user';
import firebase from 'firebase';

export type Letter = {
  title: string;
  opened: boolean;
  deliverTime: firebase.firestore.Timestamp;
  sender: string;
  body: string;
  avatarUrl?: string;
};

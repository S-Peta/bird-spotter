
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9ySyi3QPJwmgtB9xG8fdzFP0U2LP6Pt8",
  authDomain: "birdspotter-db.firebaseapp.com",
  projectId: "birdspotter-db",
  storageBucket: "birdspotter-db.appspot.com",
  messagingSenderId: "1055905898244",
  appId: "1:1055905898244:web:f5be6d18b3f91287bffa51",
  measurementId: "G-179352B53B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const firebase_auth = getAuth(app)

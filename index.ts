import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9ySyi3QPJwmgtB9xG8fdzFP0U2LP6Pt8",
  authDomain: "birdspotter-db.firebaseapp.com",
  projectId: "birdspotter-db",
  storageBucket: "birdspotter-db.appspot.com",
  messagingSenderId: "1055905898244",
  appId: "1:1055905898244:web:f5be6d18b3f91287bffa51",

  measurementId: "G-179352B53B",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const firebase_auth = getAuth(app);
export const storage = getStorage();

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9ySyi3QPJwmgtB9xG8fdzFP0U2LP6Pt8",
  authDomain: "birdspotter-db.firebaseapp.com",
  projectId: "birdspotter-db",
  storageBucket: "birdspotter-db.appspot.com",
  messagingSenderId: "1055905898244",
  appId: "1:1055905898244:web:f5be6d18b3f91287bffa51",
  measurementId: "G-179352B53B",
};

const testFirebaseConfig = {
  apiKey: "AIzaSyBliqaTr0GYn7Hyg26uqDg3DP1Q8frm0I4",
  authDomain: "testbirdspotter-db.firebaseapp.com",
  projectId: "testbirdspotter-db",
  storageBucket: "gs://test-885b4.appspot.com",
  messagingSenderId: "386643740500",
  appId: "1:386643740500:web:4b9ecf4091e2840373aac1",
  measurementId: "G-SJGE3Y0FDH",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage();

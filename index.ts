
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBliqaTr0GYn7Hyg26uqDg3DP1Q8frm0I4",
  authDomain: "testbirdspotter-db.firebaseapp.com",
  projectId: "testbirdspotter-db",
  storageBucket: "testbirdspotter-db.appspot.com",
  messagingSenderId: "386643740500",
  appId: "1:386643740500:web:4b9ecf4091e2840373aac1",
  measurementId: "G-SJGE3Y0FDH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

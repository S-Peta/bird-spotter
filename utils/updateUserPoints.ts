import { db } from "../index";
import { doc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const userAuth = getAuth();
const user = userAuth.currentUser;

const userRef = doc(db, "Users", user!.uid);

export async function updateUserTenPoints() {
  await updateDoc(userRef, {
    points: increment(10),
  });
}
export async function updateUserTwentyPoints() {
  await updateDoc(userRef, {
    points: increment(20),
  });
}

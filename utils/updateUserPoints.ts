import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../index";
import { firebase_auth } from "../index";
import { getAuth } from "firebase/auth";
import { getUsers } from "./getData";
import { useContext, useEffect, useState } from "react";
import { PointsContext } from "../Contexts/Points";
import { getPointsForUser } from "./getData";

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

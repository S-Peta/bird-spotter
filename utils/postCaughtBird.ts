import { db } from "../index";
import { doc, addDoc, GeoPoint, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const userAuth = getAuth();
const user = userAuth.currentUser;

export default async function postCaughtBird(
  species: string,
  latitude: number,
  longitude: number
) {
  const caughtBirds = collection(db, "Caught Birds");
  const geoPoint = new GeoPoint(latitude, longitude);
  const caughtBirdData = {
    created_at: new Date(),
    location: geoPoint,
    species: species,
    user_id: user?.uid,
  };
  await addDoc(caughtBirds, caughtBirdData);
}

import { db } from "../index";
import { getAuth } from "firebase/auth";
import { doc, addDoc, GeoPoint, collection } from "firebase/firestore";

export default async function postCaughtBird(
  species: string,
  latitude: number,
  longitude: number
) {
  const userAuth = getAuth();
  const user = userAuth.currentUser;
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

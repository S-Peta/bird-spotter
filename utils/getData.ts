import {
  collection,
  getDocs,
  doc,
  getDoc,
  limit,
  startAfter,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, storage } from "../index";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export async function getUsers(): Promise<User[]>  {
  const usersCol = collection(db, "Users");
  const usersSnapshot = await getDocs(usersCol);
  const usersList = usersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      avatar: data.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCFoiI5GIjAzBXk4FCP0PhikiWkT5cbBQi492KoVj6hXm1W2zppE3hBQ6fdL07Wv-PYjU&usqp=CAU',
      points: data.points || 0,
      username: data.username || 'Unknown',
    };
  });
  return usersList;
}
type User = {
  avatar: string;
  points: number;
  username: string;
};
export async function getCaughtBirds(userID: string, resultsPerPage?: number) {
  const caughtBirdsCol = collection(db, "Caught Birds");
  let caughtBirdsQuery = query(
    caughtBirdsCol,
    where("user_id", "==", userID)
  );
  if (resultsPerPage) {
    caughtBirdsQuery = query(caughtBirdsQuery, orderBy("created_at", "desc"), limit(resultsPerPage))
  }
  try {
    const caughtBirdsSnapshot = await getDocs(caughtBirdsQuery);
    const caughtBirdsList = caughtBirdsSnapshot.docs.map((doc) => doc.data());
    return caughtBirdsList;
  } catch (error) {
    console.error("Error fetching caught birds:", error);
    throw new Error("Failed to fetch caught birds");
  }
}

export async function getCaughtAllBirds() {
  const caughtBirdsCol = collection(db, "Caught Birds");
  const caughtBirdsSnapshot = await getDocs(caughtBirdsCol);
  const caughtBirdsList = caughtBirdsSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return caughtBirdsList;
}

export async function getCaughtBirdSpecies(userID: string) {
  const caughtBirdsCol = collection(db, "Caught Birds");
  const caughtBirdsQuery = query(
    caughtBirdsCol,
    where("user_id", "==", userID)
  );
  const caughtBirdsSnapshot = await getDocs(caughtBirdsQuery);
  const caughtBirdsList = caughtBirdsSnapshot.docs.map((doc) => {
    return doc.data();
  });
  const caughtBirdSpecies = caughtBirdsList.map((caughtBird) => {
    return caughtBird.species;
  });
  return caughtBirdSpecies;
}

export async function getBirds(resultsPerPage: number) {
  const firstPage = query(
    collection(db, "Bird_Species"),
    limit(resultsPerPage)
  );
  const birdsSnapshot = await getDocs(firstPage);
  const lastVisible = birdsSnapshot.docs[birdsSnapshot.docs.length - 1];
  const birdsList = birdsSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return { birdsList, lastVisible };
}

export async function getMoreBirds(startAft: {}, resultsPerPage: number) {
  const firstPage = query(
    collection(db, "Bird_Species"),
    startAfter(startAft),
    limit(resultsPerPage)
  );
  const birdsSnapshot = await getDocs(firstPage);
  const lastVisible = birdsSnapshot.docs[birdsSnapshot.docs.length - 1];
  const birdsList = birdsSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return { birdsList, lastVisible };
}

export async function getPointsForUser(userID: string) {
  const docRef = doc(db, "Users", userID);
  const docSnap = await getDoc(docRef);
  const userPoints = docSnap.data()?.points;
  return userPoints;
}
export async function getUsername(userID: string) {
  const docRef = doc(db, "Users", userID);
  const docSnap = await getDoc(docRef);
  const userUsername = docSnap.data()?.username;
  return userUsername;
}
export async function getCaughtBirdScientificName(speciesName:string) {
  const birdSpeciesCol = collection(db, "Bird_Species")
  const birdQuery = query(birdSpeciesCol, where("species", "==", speciesName))
  const birdQuerySnapshot = await getDocs(birdQuery)
  const scientificName = birdQuerySnapshot.docs[0].data().scientific_name
  return scientificName
}
export async function getBirdsImageUrls(speciesName: string[]) {
  const urls = [];
  for (const species of speciesName) {
    try {
      const imageRef = ref(
        storage,
        `assets/bird-species-images/${species}/2.jpg`
      );
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    } catch (err) {
      console.log(err);
    }
  }
  return urls;
}

export async function getABirdImageUrl(species: string) {
  try {
    const imageRef = ref(
      storage,
      `assets/bird-species-images/${species}/2.jpg`
    );
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (err) {
    console.log(err);
  }
}

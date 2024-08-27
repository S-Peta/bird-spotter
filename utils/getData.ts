import { collection, getDocs, doc, getDoc, limit, startAfter, query, where} from 'firebase/firestore';
import { db, storage } from '../index';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
export async function getUsers() {
  const usersCol = collection(db, 'Users')
  const usersSnapshot = await getDocs(usersCol)
  const usersList = usersSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return usersList
}

export async function getCaughtBirds(userID:string) {
  const caughtBirdsCol = collection(db, 'Caught Birds')
  const caughtBirdsQuery = query(caughtBirdsCol, where('user_id', '==', userID))
  const caughtBirdsSnapshot = await getDocs(caughtBirdsQuery)
  const caughtBirdsList = caughtBirdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return caughtBirdsList
}

export async function getCaughtAllBirds() {
  const caughtBirdsCol = collection(db, 'Caught Birds')
  const caughtBirdsSnapshot = await getDocs(caughtBirdsCol)
  const caughtBirdsList = caughtBirdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return caughtBirdsList
}

export async function getCaughtBirdSpecies(userID:string) {
  const caughtBirdsCol = collection(db, 'Caught Birds')
  const caughtBirdsQuery = query(caughtBirdsCol, where('user_id', '==', userID))
  const caughtBirdsSnapshot = await getDocs(caughtBirdsQuery)
  const caughtBirdsList = caughtBirdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  const caughtBirdSpecies = caughtBirdsList.map((caughtBird) => {
    return caughtBird.species
  })
  return  caughtBirdSpecies
}

export async function getBirds(resultsPerPage:number) {
  const firstPage = query(collection(db, 'Bird_Species'), limit(resultsPerPage))
  const birdsSnapshot = await getDocs(firstPage)
  const lastVisible = birdsSnapshot.docs[birdsSnapshot.docs.length -1]
  const birdsList = birdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return {birdsList, lastVisible}
}

export async function getMoreBirds(startAft:{}, resultsPerPage:number) {
  const firstPage = query(collection(db, 'Bird_Species'), startAfter(startAft),limit(resultsPerPage))
  const birdsSnapshot = await getDocs(firstPage)
  const lastVisible = birdsSnapshot.docs[birdsSnapshot.docs.length -1]
  const birdsList = birdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return {birdsList, lastVisible}
}

export async function getPointsForUser(userID:string) {
    const docRef = doc(db, 'Users', userID)
    const docSnap = await getDoc(docRef)
    const userPoints = docSnap.data()?.points
    return userPoints
}

export async function getBirdsImageUrls(speciesName:string[]) {
  const urls = []
  for (const species of speciesName){
    try {
      const imageRef = ref(storage, `assets/bird-species-images/${species}/2.jpg`)
      const url = await getDownloadURL(imageRef)
      urls.push(url)
    } catch(err) {
      console.log(err)
    }
  }
  return urls
}

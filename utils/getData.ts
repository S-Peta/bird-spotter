import { collection, getDocs, doc, getDoc} from 'firebase/firestore';
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

export async function getCaughtBirds() {
  const caugthBirdsCol = collection(db, 'Caught Birds')
  const caugthBirdsSnapshot = await getDocs(caugthBirdsCol)
  const caugthBirdsList = caugthBirdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return caugthBirdsList
}

export async function getBirds() {
  const birdsCol = collection(db, 'Bird_Species')
  const birdsSnapshot = await getDocs(birdsCol)
  const birdsList = birdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return birdsList
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

// http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Black and yellow broadbill&format=json
// // .query --> .search[0].title & .pageid

// http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=BLACK%20francolin&format=json
// // .query.pages.[pageid].extract
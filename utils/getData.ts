import { collection, getDocs } from 'firebase/firestore';

export async function getUsers(db:any) {
  const usersCol = collection(db, 'Users')
  const usersSnapshot = await getDocs(usersCol)
  const usersList = usersSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return usersList
}

export async function getCaughtBirds(db:any) {
  const caugthBirdsCol = collection(db, 'Caught Birds')
  const caugthBirdsSnapshot = await getDocs(caugthBirdsCol)
  const caugthBirdsList = caugthBirdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return caugthBirdsList
}

export async function getBirds(db:any) {
  const birdsCol = collection(db, 'birds')
  const birdsSnapshot = await getDocs(birdsCol)
  const birdsList = birdsSnapshot.docs.map((doc) => {
    return doc.data()
  })
  return birdsList
}


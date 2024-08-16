import { collection, getDocs } from 'firebase/firestore';

export async function getUsers(db:any, collectionName:string) {
    const usersCol = collection(db, collectionName)
    const usersSnapshot = await getDocs(usersCol)
    const usersList = usersSnapshot.docs.map((doc) => {
      return doc.data()
    })
    return usersList
  }
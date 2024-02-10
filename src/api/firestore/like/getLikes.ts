import { db } from "@/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getLikesApi = async (userId: string) => {
  const collectionRef = collection(db, "likes")
  const q = query(collectionRef, where("userId", "==", userId))
  const querySnapshot = await getDocs(q)
  const likes = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  console.log({ likes })

  return likes
}

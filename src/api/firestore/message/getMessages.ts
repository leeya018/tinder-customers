import { db } from "@/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getMessagesApi = async (userId: string) => {
  const collectionRef = collection(db, "messages")
  const q = query(collectionRef, where("userId", "==", userId))
  const querySnapshot = await getDocs(q)
  const messages = querySnapshot.docs.map((doc) => ({
    id: doc.id,

    ...doc.data(),
  }))
  console.log({ messages })

  return messages
}

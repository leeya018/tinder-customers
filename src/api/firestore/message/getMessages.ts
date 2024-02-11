import { db } from "@/firebase"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"

export const getMessages = async (userId: string) => {
  const collectionRef = collection(db, "messages")
  try {
    const q = query(collectionRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return []
    const messages = querySnapshot.docs.map((doc) => doc.data())
    console.log({ messages })

    return messages
  } catch (error: any) {
    console.log("no data in messages", error.message)
    return []
  }
}

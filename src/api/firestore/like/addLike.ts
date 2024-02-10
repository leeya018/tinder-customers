import { db } from "@/firebase"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { Like } from "./interfaces"

export const addLikeApi = async (newLike: Like): Promise<string | void> => {
  try {
    const likeCollectionRef = collection(db, "likes")
    const docRef = await addDoc(likeCollectionRef, newLike)

    // Assuming docRef.id always exists if addDoc succeeds, no need to explicitly check for it
    console.log(`New like added with ID: ${docRef.id}`)
    return docRef.id
  } catch (error) {
    // More specific error handling can be implemented based on the types of errors you expect
    console.error("Error adding new like:", error)
    throw new Error("Failed to add new like.") // Optionally re-throw to allow caller to handle the error
  }
}

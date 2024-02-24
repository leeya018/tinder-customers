import { db } from "@/firebase"
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import { info } from "./interfaces"

export const addInfo = async (newInfo: info) => {
  try {
    const colRef = collection(db, "info")
    const doc = await addDoc(colRef, {
      ...newInfo,
      createdDate: serverTimestamp(),
    })
    return doc.id
  } catch (error) {
    console.log("Error in addLike function: ", error)
    throw new Error("Error in addLike function")
  }
}

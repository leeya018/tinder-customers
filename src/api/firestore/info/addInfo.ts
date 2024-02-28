import { db } from "@/firebase"

import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { info } from "./interfaces"

export const addInfo = async (newInfo: info): Promise<string | void> => {
  try {
    const colRef = collection(db, "info")
    const doc = await addDoc(colRef, {
      ...newInfo,
      createdDate: serverTimestamp(),
    })
    return doc.id
  } catch (error) {
    console.log("Error in addInfo function: ", error)
    throw error
  }
}

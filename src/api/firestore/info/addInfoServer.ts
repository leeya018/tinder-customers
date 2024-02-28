import { getAdminDb } from "@/firebaseAdmin"
import * as admin from "firebase-admin"
import { info } from "./interfaces"

export const addInfoServer = async (newInfo: info): Promise<string | void> => {
  try {
    const db = await getAdminDb()
    const doc = await db.collection("info").add({
      ...newInfo,
      createdDate: admin.firestore.FieldValue.serverTimestamp(),
    })

    return doc.id
  } catch (error) {
    console.log("Error in addInfo function: ", error)
    throw error
  }
}

import { getAdminDb } from "@/firebaseAdmin"
import * as admin from "firebase-admin"

export const isCustomerExistServer = async (customerId: string) => {
  const db = await getAdminDb()

  const userDocRef = db.collection("customers").doc(customerId)
  const userDocSnap = await userDocRef.get()
  return userDocSnap.exists
}

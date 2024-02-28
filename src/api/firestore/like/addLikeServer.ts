import * as admin from "firebase-admin"

import { Like } from "./interfaces"
import { isCustomerExist } from "../customer/isCustomerExist"
import { addCustomer } from "../customer/addCustomer"
import { Customer } from "../customer/interfaces"
import { getAdminDb } from "@/firebaseAdmin"
import { isCustomerExistServer } from "../customer/isCustomerExistServer"
import { addCustomerServer } from "../customer/addCustomerServer"

export const addLikeServer = async (
  newLike: Like,
  customer: Customer
): Promise<string | void> => {
  try {
    const { userId, createdDate, likeUrl } = newLike
    const isExists = await isCustomerExistServer(userId)
    if (!isExists) {
      await addCustomerServer(customer)
    }
    const db = await getAdminDb()

    // Start of the day
    const startOfDay = new Date(createdDate.toDate().setHours(0, 0, 0, 0))

    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(startOfDay.getDate() + 1)

    const messageCollectionRef = db.collection("likes")
    const q = messageCollectionRef
      .where("userId", "==", userId)
      .where(
        "createdDate",
        ">=",
        admin.firestore.Timestamp.fromDate(startOfDay)
      )
      .where("createdDate", "<", admin.firestore.Timestamp.fromDate(endOfDay))

    const querySnapshot = await q.get()

    if (!querySnapshot.empty) {
      // Update the first document found
      const documentToUpdate = querySnapshot.docs[0]
      await documentToUpdate.ref.update({
        likeUrls: admin.firestore.FieldValue.arrayUnion(likeUrl),
      })
      console.log("Document updated successfully")
      return "Document updated successfully"
    } else {
      // Add a new document if no matching document is found
      const docRef = await messageCollectionRef.add({
        userId,
        createdDate: admin.firestore.Timestamp.fromDate(createdDate.toDate()),
        likeUrls: [likeUrl],
      })
      console.log("Like added successfully")
      return docRef.id
    }
  } catch (error) {
    console.log("Error in addLike function: ", error)
    throw error
  }
}

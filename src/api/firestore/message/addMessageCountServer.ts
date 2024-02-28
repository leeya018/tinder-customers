import * as admin from "firebase-admin"

import { Message } from "./interfaces"
import { isCustomerExist } from "../customer/isCustomerExist"
import { addCustomer } from "../customer/addCustomer"
import { Customer } from "../customer/interfaces"
import { getAdminDb } from "@/firebaseAdmin"
import { addCustomerServer } from "../customer/addCustomerServer"
import { isCustomerExistServer } from "../customer/isCustomerExistServer"

export const addMessageCountServer = async (
  newMessage: Message,
  customer: Customer
) => {
  try {
    const { userId, createdDate } = newMessage
    const isExists = await isCustomerExistServer(userId)
    if (!isExists) {
      await addCustomerServer(customer)
    }
    const db = await getAdminDb()
    if (!createdDate) throw new Error("createdDate is not exists")

    // Start of the day
    const startOfDay = new Date(createdDate.toDate().setHours(0, 0, 0, 0))
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(startOfDay.getDate() + 1)

    const messageCollectionRef = db.collection("messages")
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
        amount: admin.firestore.FieldValue.increment(1),
      })
      console.log("Document updated successfully")
      return "Document updated successfully"
    } else {
      // Add a new document if no matching document is found
      const docRef = await messageCollectionRef.add({
        ...newMessage,
        createdDate: admin.firestore.Timestamp.fromDate(createdDate.toDate()),
      })
      console.log("Message added successfully")
      return docRef.id
    }
  } catch (error) {
    console.log("Error in addMessageCountServer function: ", error)
    throw error
  }
}

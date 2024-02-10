import {
  getDocs,
  collection,
  Timestamp,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  updateDoc,
  increment,
} from "firebase/firestore"
import { db } from "@/firebase"
import { Message } from "./interfaces"

export const addMessageCountApi = async (newMessage: Message) => {
  const { userId, createdDate } = newMessage
  const date = createdDate.toDate()

  // Create a new Date object representing the start of the day for 'date'
  const startOfDay = new Date(date.setHours(0, 0, 0, 0))

  // Start of the next day
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1)

  const messageCollectionRef = collection(db, "messages")

  console.log(Timestamp.fromDate(startOfDay), Timestamp.fromDate(endOfDay))
  const q = query(messageCollectionRef, where("userId", "==", userId))
  // where("createdDate", ">=", Timestamp.fromDate(startOfDay)),
  // where("createdDate", "<", Timestamp.fromDate(endOfDay))
  // )

  getDocs(q)
    .then(async (querySnapshot) => {
      if (!querySnapshot.empty) {
        // Assuming you're interested in updating the first document found
        const documentToUpdate = querySnapshot.docs[0]
        if (!documentToUpdate) {
          const docRef = await addDoc(messageCollectionRef, newMessage)

          // if (!docRef.id) {
          //   throw new Error("could not add doc message")
          // } else {
          //   console.log("doc message created ")
          //   return true
          // }
        }
        // Get a reference to the document
        const docRef = doc(db, "messages", documentToUpdate.id)

        // Increment the 'counter' property
        await updateDoc(docRef, {
          amount: increment(1), // Use the increment operation to increase the counter by 1
        })

        console.log("Document updated successfully")
      } else {
        const docRef = await addDoc(messageCollectionRef, newMessage)
        if (docRef.id) {
          console.log("message add successfully")
        } else {
          throw new Error("cannot add nwe doc")
        }

        console.log("No documents found matching the criteria.")
      }
    })
    .catch((error) => {
      console.error("Error updating document: ", error)
    })
}

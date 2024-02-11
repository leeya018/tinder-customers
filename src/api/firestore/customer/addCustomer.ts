import { db } from "@/firebase"
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore"
import { Customer } from "./interfaces"

export const addCustomer = async (customer: Customer) => {
  try {
    const docRef = doc(db, "customers", customer.id)
    await setDoc(docRef, customer)
  } catch (error) {
    const e = error as Error
    console.log(e.message)
  }
}

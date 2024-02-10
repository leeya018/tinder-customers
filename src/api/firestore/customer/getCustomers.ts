import { db } from "@/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getCustomers = async (customerId: string) => {
  const collectionRef = collection(db, "customers")
  const q = query(collectionRef, where("id", "==", customerId))
  const querySnapshot = await getDocs(q)
  const customers = querySnapshot.docs.map((doc) => ({
    id: doc.id,

    ...doc.data(),
  }))
  console.log({ customers })

  return customers
}

import { Customer } from "./interfaces"
import { getAdminDb } from "@/firebaseAdmin"

export const addCustomerServer = async (customer: Customer) => {
  const db = await getAdminDb()

  const docRef = db.collection("customers").doc(customer.id)
  await docRef.set(customer)
}

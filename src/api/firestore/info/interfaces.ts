import { Timestamp } from "firebase/firestore"

export type info = {
  type: string
  data: string
  createdDate?: Timestamp
  customerName?: string
}

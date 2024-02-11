import {
  getCustomersFirestore,
  getLikesFirestore,
  getMessagesFirestore,
} from "@/api/firestore"
import { Customer } from "@/api/firestore/customer/interfaces"
import { Message } from "@/api/firestore/message/interfaces"
import { modals } from "@/util"
import { Timestamp } from "firebase/firestore"
import { makeAutoObservable } from "mobx"

// const data: Customer[] = [
//   {
//     id: "cust123",
//     name: "Lee",
//   },
//   {
//     id: "cust121",
//     name: "Rich",
//   },
// ]

class CustomerS {
  customers: Customer[] = []
  chosenCustomer: Customer | null = null
  likes: any[] = []
  messages: any[] = []

  constructor() {
    makeAutoObservable(this)
    this.getCustomers()
  }

  setChosenCustomer(customer: Customer) {
    this.chosenCustomer = customer
    this.getMessages(customer.id)
    this.getLikes(customer.id)
  }
  async getCustomers() {
    this.customers = await getCustomersFirestore()
  }
  async getLikes(customerId: string) {
    this.likes = await getLikesFirestore(customerId)
  }
  async getMessages(customerId: string) {
    this.messages = await getMessagesFirestore(customerId)
  }
}
export const CustomerStore = new CustomerS()

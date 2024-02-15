import {
  getCustomersFirestore,
  getLikesFirestore,
  getMessagesFirestore,
} from "@/api/firestore"
import { Customer } from "@/api/firestore/customer/interfaces"
import { Message } from "@/api/firestore/message/interfaces"
import { modals } from "@/util"
import { Timestamp } from "firebase/firestore"
import { autorun, makeAutoObservable, toJS } from "mobx"
import { makePersistable } from "mobx-persist-store"

class CustomerS {
  customersXlsData: any[] = []
  customers: Customer[] = []
  chosenCustomer: Customer | null = null
  likes: any[] = []
  messages: any[] = []

  constructor() {
    makeAutoObservable(this)
    this.getCustomers()
    if (typeof window !== "undefined") {
      makePersistable(this, {
        name: "customerStore",
        properties: ["customers"],
        storage: window.localStorage,
      })
      // makePersistable(this, {
      //   name: "customerStore",
      //   properties: ["customersXlsData"],
      //   storage: window.localStorage,
      // })
    }
  }

  setCustomersXls(xlsDataJson: any) {
    const headers = xlsDataJson[0]
    const result = xlsDataJson.slice(1).map((row) => {
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = row[index]
      })
      return obj
    })
    this.customersXlsData = result
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

autorun(() => {
  // console.log(toJS(CustomerStore.customersXlsData))
  // for (const item of CustomerStore.customersXlsData) {
  //   console.log(toJS(item))
  // }
})

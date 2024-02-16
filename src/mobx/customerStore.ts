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

const xlsArr = [
  {
    name: "qqq",
    token: "6c40dd8b-9982-4bd5-86d2-a74b3eae1e02",
    lookFor: "sex",
    isLookGood: 1,
    isWithLikes: 1,
    isWithMessages: 0,
    isProcess: 0,
  },
  {
    name: "www",
    token: "1c40dd8b-9982-4bd5-86d2-a74b3eae1e05",
    lookFor: "sex",
    isLookGood: 1,
    isWithLikes: 1,
    isWithMessages: 0,
    isProcess: 0,
  },
  {
    name: "www",
    token: "1c40dd8b-9982-4bd5-86d2-a74b3eae1e06",
    lookFor: "sex",
    isLookGood: 1,
    isWithLikes: 1,
    isWithMessages: 0,
    isProcess: 0,
  },
  {
    name: "www",
    token: "1c40dd8b-9982-4bd5-86d2-a74b3eae1e07",
    lookFor: "sex",
    isLookGood: 1,
    isWithLikes: 1,
    isWithMessages: 0,
  },
]
class CustomerS {
  // customersXlsData: any[] = xlsArr
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
    }
  }

  setCustomersXls(xlsDataJson: any) {
    const headers = xlsDataJson[0]
    const result = xlsDataJson.slice(1).map((row: any) => {
      const obj: any = {}
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index]
      })
      return obj
    })
    console.log({ result })
    this.customersXlsData = result
  }
  updateCustomersXls(currInd: number, infoItem: any) {
    const dupCustomersXlsData = this.customersXlsData.map((cXlsIfo, ind) => {
      if (ind === currInd) {
        return { ...cXlsIfo, ...infoItem }
      }
      return cXlsIfo
    })
    this.customersXlsData = dupCustomersXlsData
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
  // console.log(CustomerStore.customersXlsData)
  for (const item of CustomerStore.customersXlsData) {
    console.log(toJS(item))
  }
})

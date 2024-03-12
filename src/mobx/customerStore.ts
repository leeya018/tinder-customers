import {
  getCustomersFirestore,
  getLikesFirestore,
  getMessagesFirestore,
} from "@/api/firestore"
import { Customer } from "@/api/firestore/customer/interfaces"
import { autorun, makeAutoObservable, toJS } from "mobx"
import { makePersistable } from "mobx-persist-store"
import moment from "moment"
// import { xlsData } from "./xlsData"
export const customerStatus = {
  success: "success",
  failed: "failed",
}

const xlsData = [
  {
    name: "lee",
    token: process.env.NEXT_PUBLIC_MY_TINDER_TOKEN_ID,
    lookFor: "sex",
    isLookGood: 0,
    isWithLikes: 1,
    isWithMessages: 1,
    isProcess: 0,
  },
]

class CustomerS {
  customersXlsData: any[] = xlsData
  // customersXlsData: any[] = []
  customers: Customer[] = []
  chosenCustomer: Customer | null = null
  likes: any[] = []
  messages: any[] = []
  chosenUrls: string[] = []

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
  }
  async getCustomers() {
    this.customers = await getCustomersFirestore()
  }
  async getLikes(customerId: string, date: moment.Moment) {
    this.likes = await getLikesFirestore(customerId, date)
  }
  async getMessages(customerId: string, date: moment.Moment) {
    this.messages = await getMessagesFirestore(customerId, date)
  }
  setChosenImages(urls: string[]) {
    this.chosenUrls = urls
  }
}
export const CustomerStore = new CustomerS()

autorun(() => {
  // console.log(CustomerStore.customersXlsData)
  for (const item of CustomerStore.customersXlsData) {
    console.log(toJS(item))
  }
})

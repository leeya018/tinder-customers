import { Customer } from "@/api/firestore/customer/interfaces"
import { modals } from "@/util"
import { Timestamp } from "firebase/firestore"
import { makeAutoObservable } from "mobx"

const data: Customer[] = [
  {
    id: "cust123",
    name: "Lee",
    createdDate: Timestamp.now(),
  },
  {
    id: "cust121",
    name: "Rich",
    createdDate: Timestamp.now(),
  },
]

class CustomerS {
  customers: Customer[] = [...data]
  chosenCustomer: Customer | null = null

  constructor() {
    makeAutoObservable(this)
    this.getCustomers()
  }

  setChosenCustomer(customer: Customer) {
    this.chosenCustomer = customer
  }
  async getCustomers() {
    // this.customers = await getCustomersFirestore()
  }
}
export const CustomerStore = new CustomerS()

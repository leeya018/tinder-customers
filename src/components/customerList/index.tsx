import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { CustomerStore } from "@/mobx/customerStore"
import { Customer } from "@/api/firestore/customer/interfaces"
import CustomerItem from "../customerItem"

const CustomerList = observer(() => {
  return (
    <ul>
      {CustomerStore.customers.map((customer: Customer, key: number) => (
        <CustomerItem key={key} customer={customer} />
      ))}
    </ul>
  )
})

export default CustomerList

import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Customer } from "@/api/firestore/customer/interfaces"
import { CustomerStore } from "@/mobx/customerStore"

type CustomerItemProps = {
  customer: Customer
}
const CustomerItem = observer<CustomerItemProps>(({ customer }) => {
  return (
    <div
      onClick={() => CustomerStore.setChosenCustomer(customer)}
      className="w-full p-3 pl-5 flex  items-center hover:bg-color-disabled-gray"
    >
      {customer.name}
    </div>
  )
})

export default CustomerItem

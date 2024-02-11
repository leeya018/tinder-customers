import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Customer } from "@/api/firestore/customer/interfaces"
import { CustomerStore } from "@/mobx/customerStore"
import filterStore from "@/mobx/filterStore"

type CustomerItemProps = {
  customer: Customer
}
const CustomerItem = observer<CustomerItemProps>(({ customer }) => {
  const handleClick = () => {
    filterStore.setFilter(customer.name)
    CustomerStore.setChosenCustomer(customer)
  }
  return (
    <div
      onClick={handleClick}
      className="w-full p-3 pl-5 flex  items-center hover:bg-color-disabled-gray"
    >
      {customer.name}
    </div>
  )
})

export default CustomerItem

"use client"
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Title from "@/ui/title"
import FilterInput from "@/ui/input/filter"
import filterStore from "@/mobx/filterStore"
import CustomerList from "@/components/customerList"
import { CustomerStore } from "@/mobx/customerStore"
import Graph from "@/components/graph"

const ViewPage = observer(() => {
  const [isShowCustomerList, setIsShowCustomerList] = useState(false)
  const handleFocus = () => {
    setIsShowCustomerList(true)
  }
  const handleBlur = () => {
    setTimeout(() => {
      setIsShowCustomerList(false)
    }, 500)
  }

  return (
    <div className="w-[100vw] h-[100vh] mb-2">
      <div className="mt-10 w-full flex justify-center items-center">
        <div className="flex items-center">
          <Title>View customers :</Title>
          <div className="text-lg font-bold">
            {CustomerStore.chosenCustomer?.name}
          </div>
        </div>
      </div>
      <div className="w-full h-full flex justify-center ">
        <div className="w-[80%]  flex flex-col justify-center h-full gap-5">
          <div className="h-full w-full">
            <FilterInput
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => filterStore.setFilter(e.target.value)}
              value={filterStore.search}
              placeholder="search customers"
            />
            {isShowCustomerList && (
              <div className="relative w-full">
                <div className="absolute w-full">
                  <CustomerList />
                </div>
              </div>
            )}
          </div>
          {CustomerStore.chosenCustomer &&
            CustomerStore.messages.length > 0 &&
            CustomerStore.likes.length > 0 && (
              <div className="h-full flex flex-col items-center justify-center ">
                <Graph
                  likes={CustomerStore.likes}
                  messages={CustomerStore.messages}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  )
})

export default ViewPage

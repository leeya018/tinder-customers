"use client"
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Title from "@/ui/title"
import FilterInput from "@/ui/input/filter"
import filterStore from "@/mobx/filterStore"
import CustomerList from "@/components/customerList"
import { CustomerStore } from "@/mobx/customerStore"
import Graph from "@/components/graph"

import { useRouter } from "next/navigation"
import { NavNames } from "@/util"
import ProtectedRout from "@/components/protectedRout"
import Navbar from "@/components/navbar"

const ViewPage = observer(() => {
  const [isShowCustomerList, setIsShowCustomerList] = useState(false)
  const router = useRouter()

  const handleFocus = () => {
    setIsShowCustomerList(true)
  }
  const handleBlur = () => {
    setTimeout(() => {
      setIsShowCustomerList(false)
    }, 500)
  }

  return (
    <ProtectedRout>
      <div>
        <Navbar />
        <div className="w-[100vw] h-[100vh] mb-2">
          <div className="mt-10 w-full flex justify-center items-center"></div>
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
              {CustomerStore.chosenCustomer && (
                <div className="h-full flex flex-col items-center  ">
                  <Graph
                    likes={CustomerStore.likes}
                    messages={CustomerStore.messages}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRout>
  )
})

export default ViewPage

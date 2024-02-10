"use client"
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"

import { Button } from "@mui/material"
import {} from "@/api/firestore"
import Title from "@/ui/title"
import FilterInput from "@/ui/input/filter"
import filterStore from "@/mobx/filterStore"
import CustomerList from "@/components/customerList"
import { CustomerStore } from "@/mobx/customerStore"

const ViewPage = observer(() => {
  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="mt-10 w-full flex justify-center items-center">
        <div className="flex items-center">
          <Title>View customers :</Title>
          <div className="text-lg font-bold">
            {CustomerStore.chosenCustomer?.name}
          </div>
        </div>
      </div>
      <div className="w-full flex h-full gap-5">
        <div className="w-[40%]">
          <FilterInput
            onChange={(e) => filterStore.setFilter(e.target.value)}
            value={filterStore.search}
            placeholder="search customers"
          />
          <CustomerList />
        </div>
        <div className=" w-full flex flex-col items-center justify-center">
          <div>digram1</div>
          <div>digram2</div>
        </div>
      </div>
    </div>
  )
})

export default ViewPage

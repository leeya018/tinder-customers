"use client"
import React, { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"

import { Button, OutlinedInput } from "@mui/material"
import { observer } from "mobx-react-lite"
import Alerts from "@/ui/Alerts"
import { messageStore } from "@/mobx/messageStore"
import MessageModal from "@/ui/modal/message"
import { ModalStore } from "@/mobx/modalStore"
import { instructions, modals, sleep, timeBetween } from "@/pages/api/util"
import tokensStore, { Token } from "@/mobx/tokenStore"
import { useRouter } from "next/navigation"

import ProtectedRout from "@/components/protectedRout"
import Navbar from "@/components/navbar"
import CustomerCommand from "@/components/customerCommand"
import { startApi } from "@/api_client"
import LoadXls from "@/components/loadXls"
import { CustomerStore, customerStatus } from "@/mobx/customerStore"
import { toJS } from "mobx"
import { addInfoFirestore } from "@/api/firestore"

const RootPage = observer(() => {
  const { tokens, addToken, setTokens, setToken } = tokensStore
  const router = useRouter()

  // this funciton invoke start function in loop
  // each time for different customer .
  // when its done with all it will start another rotation for all

  const startAll = async () => {
    let i = 0
    while (true) {
      for (const [
        index,
        cXlsData,
      ] of CustomerStore.customersXlsData.entries()) {
        // console.log({ index, cXlsData: toJS(cXlsData) })
        // await sleep(5)

        //  this is ithe real code
        const name = await start(cXlsData, index)
        console.log(`finish iteration for ${name}`)
        // await sleep(30)
      }
      i++
      console.log(`done interation for all. iteration number: ${i}`)
      await sleep(timeBetween.SESSION_USERS) //session
    }
  }

  const start = async (customerXlsData: any, index: number) => {
    try {
      const name = await startApi(customerXlsData)
      CustomerStore.updateCustomersXls(index, {
        status: customerStatus.success,
      })
      return name
    } catch (error: any) {
      console.log(error.stack)
      CustomerStore.updateCustomersXls(index, {
        status: customerStatus.failed,
      })
      throw error
    }
  }

  return (
    <ProtectedRout>
      <Navbar />
      <div className="w-[100vw] h-[100vh] p-10 ">
        <Alerts />
        {/*  */}
        <LoadXls
          callback={(json: Object) => {
            CustomerStore.setCustomersXls(json)
          }}
        />

        <div className="w-full flex justify-between items-center "></div>
        <Button
          className={`h-10 ${
            CustomerStore.customersXlsData.length > 0 ? "cursor-pointer" : ""
          }`}
          variant="outlined"
          disabled={CustomerStore.customersXlsData.length === 0}
          onClick={startAll}
        >
          Start all
        </Button>
        <ul className="h-full overflow-scroll mt-10">
          {CustomerStore.customersXlsData.map(
            (customerXlsData: any, key: number) => (
              <CustomerCommand
                key={key}
                index={key}
                customerXlsData={customerXlsData}
                onClick={start}
              />
            )
          )}
        </ul>
      </div>
    </ProtectedRout>
  )
})

export default RootPage

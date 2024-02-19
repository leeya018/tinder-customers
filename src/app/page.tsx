"use client"
import React, { useState } from "react"
import { FaPlus } from "react-icons/fa"

import { Button, OutlinedInput } from "@mui/material"
import { observer } from "mobx-react-lite"
import Alerts from "@/ui/Alerts"
import { messageStore } from "@/mobx/messageStore"
import MessageModal from "@/ui/modal/message"
import { ModalStore } from "@/mobx/modalStore"
import { instructions, modals } from "@/util"
import tokensStore, { Token } from "@/mobx/tokenStore"
import { useRouter } from "next/navigation"

import ProtectedRout from "@/components/protectedRout"
import Navbar from "@/components/navbar"
import CustomerCommand from "@/components/customerCommand"
import { startApi } from "@/api_client"
import LoadXls from "@/components/loadXls"
import { CustomerStore } from "@/mobx/customerStore"

const RootPage = observer(() => {
  const { tokens, addToken, setTokens, setToken } = tokensStore
  const router = useRouter()

  const isPlusAvailable = () => {
    return tokensStore.tokens.length === 0 || tokens[0].name !== ""
  }

  const add = () => {
    const emptyTokensAmount = tokens.filter((token) => token.key === "").length
    if (emptyTokensAmount < 1) {
      addToken({ key: "", isProcess: false, name: "" })
    } else {
      messageStore.setMessage("cannot add more than 1 empty box", 400)
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

        <ul className="h-full overflow-scroll mt-10">
          {CustomerStore.customersXlsData.map(
            (customerXlsData: any, key: number) => (
              <CustomerCommand
                key={key}
                index={key}
                customerXlsData={customerXlsData}
              />
            )
          )}
        </ul>
      </div>
    </ProtectedRout>
  )
})

export default RootPage

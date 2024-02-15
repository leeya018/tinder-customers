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
import { startApi } from "@/lib/api"
import LoadXls from "@/components/loadXls"
import { CustomerStore } from "@/mobx/customerStore"

const RootPage = observer(() => {
  const { tokens, addToken, setTokens, setToken } = tokensStore
  const router = useRouter()

  const isPlusAvailable = () => {
    return tokensStore.tokens.length === 0 || tokens[0].name !== ""
  }

  // const start = async (index: number) => {
  //   let dupTokens = [...tokens]
  //   dupTokens[index].isProcess = true

  //   const name = await startApi(tokens[index].key)
  //   console.log(name)
  //   dupTokens[index].name = name
  //   setTokens(dupTokens)
  // }
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
        {ModalStore.modalName === modals.message && (
          <MessageModal
            onClose={() => ModalStore.closeModal()}
            title={"Benefits"}
            messageArr={instructions}
          />
        )}
        <div className="w-full flex justify-between items-center ">
          <Button
            variant="outlined"
            disabled={!isPlusAvailable()}
            className="mb-2 "
            onClick={add}
          >
            <FaPlus size={30} />
          </Button>
          <Button
            variant="outlined"
            className=" "
            onClick={() => ModalStore.openModal(modals.message)}
          >
            Benefits
          </Button>
        </div>
        {/* <ul className="mt-5">
          {tokens.map((token: Token, key: number) => (
            <CustomerCommand key={key} index={key} token={token} />
          ))}
        </ul> */}
        <ul className="mt-5">
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

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
        <LoadXls />
        {ModalStore.modalName === modals.message && (
          <MessageModal
            onClose={() => ModalStore.closeModal()}
            title={"Benefits"}
            messageArr={instructions}
          />
        )}
        <Button
          variant="outlined"
          className="absolute top-1 left-1"
          onClick={() => ModalStore.openModal(modals.message)}
        >
          Benefits
        </Button>
        <div className="flex justify-center text-xl font-bold">
          Tinder Customers
        </div>
        <div className="flex justify-center text-lg font-semibold mb-5">
          Speed your dating life with automation
        </div>

        <Button
          variant="outlined"
          disabled={!isPlusAvailable()}
          className="mb-2 "
          onClick={add}
        >
          <FaPlus size={30} />
        </Button>
        <ul className="mt-5">
          {tokens.map((token: Token, key: number) => (
            <CustomerCommand key={key} index={key} token={token} />
          ))}
        </ul>
      </div>
    </ProtectedRout>
  )
})

export default RootPage

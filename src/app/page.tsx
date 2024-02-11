"use client"
import React, { useState } from "react"
import { FaPlus } from "react-icons/fa"

import { Button, OutlinedInput } from "@mui/material"
import { observer } from "mobx-react-lite"

import { startApi } from "@/lib/api"
import Alerts from "@/ui/Alerts"
import { messageStore } from "@/mobx/messageStore"
import MessageModal from "@/ui/modal/message"
import { ModalStore } from "@/mobx/modalStore"
import { NavNames, instructions, modals } from "@/util"
import tokensStore, { Token } from "@/mobx/tokenStore"
import { useRouter } from "next/navigation"
import NavRoutButton from "@/ui/button/routNav"

const RootPage = observer(() => {
  const { tokens, addToken, setTokens, setToken } = tokensStore
  const router = useRouter()
  const isPlusAvailable = () => {
    return tokensStore.tokens.length === 0 || tokens[0].name !== ""
  }

  const start = async (index: number) => {
    let dupTokens = [...tokens]
    dupTokens[index].isProcess = true

    const name = await startApi(tokens[index].key)
    console.log(name)
    dupTokens[index].name = name
    setTokens(dupTokens)
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
    <div className="w-[100vw] h-[100vh] p-10 ">
      <Alerts />
      {/*  */}
      <NavRoutButton onClick={() => router.push(`/${NavNames.view}`)}>
        {NavNames.view}
      </NavRoutButton>
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
        The purpose of this system is to help premium customers on Tinder to
        gain more date through the system
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
          <li key={key} className="flex items-center gap-2">
            <OutlinedInput
              disabled={token.isProcess === true}
              onChange={(e) => {
                let dupTokens = [...tokens]
                dupTokens[key].key = e.target.value
                setTokens(dupTokens)
              }}
              value={token.key}
              placeholder="token"
              className="h-10"
            />
            <Button
              className="h-10"
              variant="outlined"
              disabled={token.key === "" || token.isProcess === true}
              onClick={() => start(key)}
            >
              {token.isProcess === true ? "in Process" : "Start"}
            </Button>
            <div>{token.name}</div>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default RootPage

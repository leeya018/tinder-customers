"use client"
import React, { useState } from "react"
import { FaPlus } from "react-icons/fa"

// import { getProfile } from "lib/api"
import { Button, OutlinedInput } from "@mui/material"
import { observer } from "mobx-react-lite"

import { startApi } from "@/lib/api"
import Alerts from "@/ui/Alerts"
import { messageStore } from "@/mobx/messageStore"

type Token = {
  key: string
  isProcess: boolean
  name: string
}
const RootPage = observer(() => {
  const [tokens, setTokens] = useState<Token[]>([])

  const isPlusAvailable = () => {
    return tokens.length === 0 || tokens[0].name !== ""
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
      setTokens((prev) => [{ key: "", isProcess: false, name: "" }, ...prev])
    } else {
      messageStore.setMessage("cannot add more than 1 empty box", 400)
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] p-10 ">
      <Alerts />
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
        className="mb-2"
        onClick={add}
      >
        <FaPlus size={30} />
      </Button>
      <ul>
        {tokens.map((token: Token, key: number) => (
          <li key={key} className="flex items-center gap-2">
            <OutlinedInput
              onChange={(e) => {
                let dupTokens = [...tokens]
                dupTokens[key].key = e.target.value
                setTokens(dupTokens)
              }}
              value={token.key}
              placeholder="token"
            />
            <Button
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

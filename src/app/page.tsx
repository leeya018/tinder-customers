"use client"
import React, { useState } from "react"
import { FaPlus } from "react-icons/fa"

// import { getProfile } from "lib/api"
import { Button, OutlinedInput } from "@mui/material"
import { observer } from "mobx-react-lite"
import {
  day,
  intervalForever,
  likeAll,
  likeAutomation,
  messageAutomation,
} from "@/util"
import { startApi } from "@/lib/api"

const RootPage = observer(() => {
  const [tokens, setTokens] = useState<string[]>([])
  // const [token, setToken] = useState([])
  // const [port, setPort] = useState("")

  const start = async (index: number) => {
    startApi(tokens[index])
  }
  const add = () => {
    setTokens((prev) => ["", ...prev])
  }

  return (
    <div>
      <div>customers</div>
      <Button variant="outlined" onClick={add}>
        <FaPlus size={30} />
      </Button>
      <ul>
        {tokens.map((token: string, key: number) => (
          <li key={key}>
            <OutlinedInput
              onChange={(e) => {
                let dupTokens = [...tokens]
                dupTokens[key] = e.target.value
                setTokens(dupTokens)
              }}
              value={token}
              placeholder="token"
            />
            <Button variant="outlined" onClick={() => start(key)}>
              Start
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default RootPage

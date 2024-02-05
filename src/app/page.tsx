"use client"
import React, { useState } from "react"

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
  const [token, setToken] = useState("")
  const [port, setPort] = useState("")

  const start = async () => {
    // const res = await getProfile()
    // const profile = res.data
    // const profileId = profile._id
    // console.log(profileId)
    // intervalForever(likeAll, day / 2)
    // intervalForever(likeAutomation, day / 10)
    // intervalForever(messageAutomation, day / 2)
    startApi()
  }

  return (
    <div>
      <div>customers</div>
      <OutlinedInput
        onChange={(e) => setToken(e.target.value)}
        value={token}
        placeholder="token"
      />
      <Button variant="outlined" onClick={start}>
        Start
      </Button>
    </div>
  )
})

export default RootPage

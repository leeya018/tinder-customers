"use client"
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"

import { Timestamp } from "firebase/firestore"
import { Button } from "@mui/material"
import {
  addLikeFirestore,
  addMessageCountFirestore,
  getLikesFirestore,
  getMessagesFirestore,
} from "@/api/firestore"

const newMessage = {
  userId: "1232",
  amount: 1,
  createdDate: Timestamp.now(),
}
const newLike = {
  userId: "pluyf1",
  likeUrl: "p903kslpp3l3/tinder/l3893789",
  createdDate: Timestamp.now(),
}
const HomePage = observer(() => {
  return (
    <div>
      <div>test the data in firestroe </div>
      <Button
        variant="outlined"
        className=""
        onClick={() => getMessagesFirestore("5980deb74a75f5b45fb118ee")}
      >
        get messages
      </Button>
      <Button
        variant="outlined"
        className=""
        onClick={() => getLikesFirestore("5980deb74a75f5b45fb118ee")}
      >
        get likes
      </Button>
      <Button
        variant="outlined"
        className=""
        onClick={() => addLikeFirestore(newLike)}
      >
        add like
      </Button>
      <Button
        variant="outlined"
        className=""
        onClick={() => addMessageCountFirestore(newMessage)}
      >
        add message
      </Button>
    </div>
  )
})

export default HomePage

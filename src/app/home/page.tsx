"use client"
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"

import { Timestamp } from "firebase/firestore"
import { Button } from "@mui/material"
import { getLikesApi } from "@/api/firestore/like/getLikes"
import { getMessagesApi } from "@/api/firestore/message/getMessages"
import { addMessageCountApi } from "@/api/firestore/message/addMessage"
import { addLikeApi } from "@/api/firestore/like/addLike"

const newMessage = {
  userId: "pluy1f",
  amount: 1,
  createdDate: Timestamp.now(),
}
const newLike = {
  userId: "pluyf",
  likeUrl: "p903klpp3l3/tinder/l3893789",
  createdDate: Timestamp.now(),
}
const HomePage = observer(() => {
  return (
    <div>
      <div>test the data in firestroe </div>
      <Button
        variant="outlined"
        className=""
        onClick={() => getMessagesApi("pluyf11")}
      >
        get messages
      </Button>
      <Button
        variant="outlined"
        className=""
        onClick={() => getLikesApi("pluyf1")}
      >
        get likes
      </Button>
      <Button
        variant="outlined"
        className=""
        onClick={() => addLikeApi(newLike)}
      >
        add like
      </Button>
      <Button
        variant="outlined"
        className=""
        onClick={() => addMessageCountApi(newMessage)}
      >
        add message
      </Button>
    </div>
  )
})

export default HomePage

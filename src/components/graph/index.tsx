import React from "react"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { observer } from "mobx-react-lite"

import { fromTimestampToMoment } from "@/util"
import { Message } from "@/api/firestore/message/interfaces"
import StackChart from "./stackChart"
import { toJS } from "mobx"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type GraphProps = {
  likes: any[]
  messages: Message[]
}
const Graph = observer<GraphProps>(({ likes, messages }) => {
  const convertLikes = () => {
    console.log(toJS(likes))
    const likesData = likes.map((like: any) => ({
      amount: like.likeUrls.length,
      createdDate: like.createdDate,
      // createdDate: fromTimestampToMoment(like.createdDate),
    }))
    return likesData
  }
  const convertMessages = () => {
    const likesData = messages.map((message: Message) => ({
      amount: message.amount,
      createdDate: message.createdDate,
      // createdDate: fromTimestampToMoment(message.createdDate),
    }))
    return likesData
  }
  const likesData = convertLikes()
  const messagesData = convertMessages()
  return (
    // <div className="h-full">
    <div className="flex items-center w-full" style={{ height: "700px" }}>
      <StackChart dataItems={{ likesData, messagesData }} />;
    </div>
  )
})

export default Graph

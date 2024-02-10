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

import { convertDate } from "@/util"
import { Message } from "@/api/firestore/message/interfaces"
import StackChart from "./stackChart"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type GraphProps = {
  likes: any[]
  messages: Message[]
}
const Graph = observer<GraphProps>(({ likes, messages }) => {
  const convertLikes = () => {
    const likesData = likes.map((like: any) => ({
      amount: like.likeUrls.length,
      createdDate: convertDate(like.createdDate),
    }))
    return likesData
  }
  const convertMessages = () => {
    const likesData = messages.map((message: Message) => ({
      amount: message.amount,
      createdDate: convertDate(message.createdDate),
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

import { Customer } from "@/api/firestore/customer/interfaces"
import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"
import {
  addDataToTxt,
  fileStarterNames,
  getFullStrTime,
  getRandomMessage,
  infoTypes,
  messagesFolder,
  sleep,
  timeBetween,
} from "@/pages/api/util"
import { Timestamp } from "firebase/firestore"
import { addMessageCountFirestore } from "@/api/firestore"
import { Message } from "@/api/firestore/message/interfaces"
import { getMatchesApi, sendMessageApi } from "./api"
import DetailedError from "./DetailedError"
import { addMessageCountServer } from "@/api/firestore/message/addMessageCountServer"
import { addInfoServer } from "@/api/firestore/info/addInfoServer"

const payload = {
  message: 0,
  amount: 60,
  is_tinder_u: true,
}

export const messageAutomation = async (
  customer: Customer,
  customerXlsData: CustomerXlsData,
  lang: string
) => {
  console.log("================== MESSAGE_AUTOMATION ========================")
  try {
    const { token } = customerXlsData
    console.log("Customer:", customer)

    const res = await getMatchesApi(token, payload)
    const matches = res.data?.matches
    console.log("Matches count:", matches.length)
    console.log("Message automation language:", lang)

    for (const match of matches) {
      const fileStarterName =
        fileStarterNames[lang.toLowerCase()] || fileStarterNames.english
      const message = getRandomMessage(`${fileStarterName}.txt`)
      const payloadMessage = {
        userId: customer.id,
        otherId: match?.person._id,
        matchId: match?.id,
        sessionId: null,
        message,
      }
      console.log("Sending message:", message, "to:", match.person._id)
      await sendMessageApi(token, payloadMessage)

      const newMessage: Message = {
        userId: customer.id,
        amount: 1,
        createdDate: Timestamp.now(),
      }
      // addDataToTxt(messagesFolder, "messages.txt", message)
      addInfoServer({
        customerName: customer.name,
        data: message,
        type: infoTypes.MESSAGE,
      })
      await addMessageCountServer(newMessage, customer)
      await sleep(timeBetween.ENGAGEMENT)
    }
  } catch (error: any) {
    throw new DetailedError(error.message, customer.name)
  }
}

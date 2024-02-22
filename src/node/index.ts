import { addLikeFirestore, addMessageCountFirestore } from "@/api/firestore"
import { Customer } from "@/api/firestore/customer/interfaces"
import { Like } from "@/api/firestore/like/interfaces"
import { Message } from "@/api/firestore/message/interfaces"
import {
  actionsFolder,
  addDataToTxt,
  errorsFolder,
  getFullStrTime,
} from "@/pages/api/util"
import { Timestamp } from "firebase/firestore"

import { getDataFromGptApi } from "@/api_client"
import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"
import { messageAutomation } from "./messageAutomation"
import { likeAutomation } from "./likeAutomation"
import { likeAll } from "./likeAll"
import { getProfileApi } from "./api"
import path from "path"
import DetailedError from "./DetailedError"

// the real main function
const main = async (customerXlsData: CustomerXlsData) => {
  const hour = 60 * 60
  const day = hour * 24

  try {
    const { token, isWithMessages, isWithLikes } = customerXlsData
    console.log("================== START_MAIN ========================")

    const profileResponse = await getProfileApi(token)
    console.log("================== getProfileApi ========================")
    const { travel, user } = profileResponse.data
    const isTraveling = travel?.is_traveling
    const location = isTraveling ? travel.travel_pos : user.pos
    console.log({ isTraveling, travelPos: travel?.travel_pos, myPos: user.pos })

    const question = `What is the speaking language in ${JSON.stringify(
      location
    )} in 1 word only`
    console.log({ question })
    const lang = await getDataFromGptApi(question)
    console.log("================== getDataFromGptApi ========================")
    console.log({ lang })

    const customer: Customer = {
      id: user._id,
      name: user.name,
    }
    console.log("Customer:", customer)

    if (isWithLikes) {
      addDataToTxt(actionsFolder, "functions.txt", `likeAll start`)
      await likeAll(customer, customerXlsData)
      addDataToTxt(actionsFolder, "functions.txt", `likeAll end`)
      addDataToTxt(actionsFolder, "functions.txt", `likeAutomation start`)
      await likeAutomation(customer, customerXlsData)
      addDataToTxt(actionsFolder, "functions.txt", `likeAutomation end`)
    }
    console.log({ isWithMessages })
    if (isWithMessages) {
      addDataToTxt(actionsFolder, "functions.txt", `messageAutomation start`)
      await messageAutomation(customer, customerXlsData, lang)
      addDataToTxt(actionsFolder, "functions.txt", `messageAutomation end`)
    }

    console.log("================== END_MAIN ========================")
    return user.name
  } catch (error: any) {
    let errStr = ""
    if (error instanceof DetailedError) {
      errStr = `${error.date}---${error.customerName}---${error.message}`
    } else {
      errStr = error.message
    }
    const errorFile = path.join(errorsFolder, "errors.txt")

    addDataToTxt(errorFile, "", errStr)
  }
}

// main funciton just for testing
// const main = async (customerXlsData: CustomerXlsData) => {
//   await sleep()
//   return customerXlsData.name
// }

module.exports = { main }

import {
  addInfoFirestore,
  addLikeFirestore,
  addMessageCountFirestore,
  getLikesFirestore,
} from "@/api/firestore"
import { Customer } from "@/api/firestore/customer/interfaces"

import {
  actionsFolder,
  addDataToTxt,
  errorsFolder,
  getFullStrTime,
  getRandomMessage,
  infoTypes,
  intervalForever,
  timeBetween,
} from "@/pages/api/util"
import { Timestamp } from "firebase/firestore"

import { getDataFromGptApi } from "@/api_client"
import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"
import { messageAutomation } from "./messageAutomation"
import { likeAutomation } from "./likeAutomation"
import { likeAll } from "./likeAll"
import { getProfileApi, likeUserApi } from "./api"
import path from "path"
import DetailedError from "./DetailedError"
import { info } from "@/api/firestore/info/interfaces"
import moment from "moment"
import { addInfoServer } from "@/api/firestore/info/addInfoServer"

import { Message } from "@/api/firestore/message/interfaces"
import { isCustomerExistServer } from "@/api/firestore/customer/isCustomerExistServer"
import { addCustomerServer } from "@/api/firestore/customer/addCustomerServer"
import { addLikeServer } from "@/api/firestore/like/addLikeServer"
import { Like } from "@/api/firestore/like/interfaces"
import { addMessageCountServer } from "@/api/firestore/message/addMessageCountServer"
import { getAdminDb } from "@/firebaseAdmin"
import { getRecs } from "./getRecs"
import { handleLike } from "./handleLike"

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
      await addInfoServer({
        customerName: customer.name,
        data: `likeAll start`,
        type: infoTypes.FUNCTION,
      })

      addDataToTxt(actionsFolder, "functions.txt", `likeAll start`)

      await likeAll(customer, customerXlsData)
      await addInfoServer({
        customerName: customer.name,
        data: `likeAll end`,
        type: infoTypes.FUNCTION,
      })

      addDataToTxt(actionsFolder, "functions.txt", `likeAll end`)
      addDataToTxt(actionsFolder, "functions.txt", `likeAutomation start`)
      await addInfoServer({
        customerName: customer.name,
        data: `likeAutomation start`,
        type: infoTypes.FUNCTION,
      })

      await likeAutomation(customer, customerXlsData)
      await addInfoServer({
        customerName: customer.name,
        data: `likeAutomation end`,
        type: infoTypes.FUNCTION,
      })

      addDataToTxt(actionsFolder, "functions.txt", `likeAutomation end`)
    }
    console.log({ isWithMessages })
    if (isWithMessages) {
      addDataToTxt(actionsFolder, "functions.txt", `messageAutomation start`)
      await addInfoServer({
        customerName: customer.name,
        data: `messageAutomation start`,
        type: infoTypes.FUNCTION,
      })

      await messageAutomation(customer, customerXlsData, lang)
      await addInfoServer({
        customerName: customer.name,
        data: `messageAutomation end`,
        type: infoTypes.FUNCTION,
      })

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
    // const errorFile = path.join(errorsFolder, "errors.txt")
    await addInfoServer({
      customerName: error.customerName,
      data: error.message,
      type: infoTypes.ERROR,
    })
    return "done"
  }
}

const addInfoApi = async (newInfo: info) => {
  try {
    const db = await getAdminDb()
    console.log(" am in the main funciton ")
    const docRef = await db.collection("info").add(newInfo)
    console.log(" am in the end main funciton ")
    console.log(docRef.id)
  } catch (error) {
    console.log(" am in the error ")
    console.error(error)
  }
}

const mainIteration = async (customerXlsData: CustomerXlsData) => {
  // const customerXlsDataTmp: CustomerXlsData = {
  //   name: "lee",
  //   token: process.env.NEXT_PUBLIC_MY_TINDER_TOKEN_ID || "",
  //   lookFor: "sex",
  //   isLookGood: false,
  //   isWithLikes: true,
  //   isWithMessages: true,
  //   isProcess: false,
  // }
  // intervalForever(() => main(customerXlsDataTmp), timeBetween.SESSION_USERS)
  intervalForever(() => main(customerXlsData), timeBetween.SESSION_USERS)
}

module.exports = { mainIteration }

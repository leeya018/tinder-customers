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
  infoTypes,
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

import { Like } from "@/api/firestore/like/interfaces"
import { getLikes } from "@/api/firestore/like/getLikes"
import moment from "moment"

// the real main function
// const main = async (customerXlsData: CustomerXlsData) => {
//   const hour = 60 * 60
//   const day = hour * 24

//   try {
//     const { token, isWithMessages, isWithLikes } = customerXlsData
//     console.log("================== START_MAIN ========================")

//     const profileResponse = await getProfileApi(token)
//     console.log("================== getProfileApi ========================")
//     const { travel, user } = profileResponse.data
//     const isTraveling = travel?.is_traveling
//     const location = isTraveling ? travel.travel_pos : user.pos
//     console.log({ isTraveling, travelPos: travel?.travel_pos, myPos: user.pos })

//     const question = `What is the speaking language in ${JSON.stringify(
//       location
//     )} in 1 word only`
//     console.log({ question })
//     const lang = await getDataFromGptApi(question)
//     console.log("================== getDataFromGptApi ========================")
//     console.log({ lang })

//     const customer: Customer = {
//       id: user._id,
//       name: user.name,
//     }
//     console.log("Customer:", customer)

//     if (isWithLikes) {
//       // addInfoFirestore({
//       //   customerName: customer.name,
//       //   data: `likeAll start`,
//       //   type: infoTypes.FUNCTION,
//       // })

//       addDataToTxt(actionsFolder, "functions.txt", `likeAll start`)

//       await likeAll(customer, customerXlsData)
//       // addInfoFirestore({
//       //   customerName: customer.name,
//       //   data: `likeAll end`,
//       //   type: infoTypes.FUNCTION,
//       // })

//       addDataToTxt(actionsFolder, "functions.txt", `likeAll end`)
//       addDataToTxt(actionsFolder, "functions.txt", `likeAutomation start`)
//       // addInfoFirestore({
//       //   customerName: customer.name,
//       //   data: `likeAutomation start`,
//       //   type: infoTypes.FUNCTION,
//       // })

//       await likeAutomation(customer, customerXlsData)
//       // addInfoFirestore({
//       //   customerName: customer.name,
//       //   data: `likeAutomation end`,
//       //   type: infoTypes.FUNCTION,
//       // })

//       addDataToTxt(actionsFolder, "functions.txt", `likeAutomation end`)
//     }
//     console.log({ isWithMessages })
//     if (isWithMessages) {
//       addDataToTxt(actionsFolder, "functions.txt", `messageAutomation start`)
//       // addInfoFirestore({
//       //   customerName: customer.name,
//       //   data: `messageAutomation start`,
//       //   type: infoTypes.FUNCTION,
//       // })

//       await messageAutomation(customer, customerXlsData, lang)
//       // addInfoFirestore({
//       //   customerName: customer.name,
//       //   data: `messageAutomation end`,
//       //   type: infoTypes.FUNCTION,
//       // })

//       addDataToTxt(actionsFolder, "functions.txt", `messageAutomation end`)
//     }

//     console.log("================== END_MAIN ========================")
//     return user.name
//   } catch (error: any) {
//     let errStr = ""
//     if (error instanceof DetailedError) {
//       errStr = `${error.date}---${error.customerName}---${error.message}`
//     } else {
//       errStr = error.message
//     }
//     const errorFile = path.join(errorsFolder, "errors.txt")
//     // addInfoFirestore({
//     //   customerName: error.customerName,
//     //   data: error.message,
//     //   type: infoTypes.ERROR,
//     // })

//     addDataToTxt(errorFile, "", errStr)
//   }
// }

const main = async (customerXlsData: CustomerXlsData) => {
  const { token } = customerXlsData

  const profileResponse = await getProfileApi(token)
  console.log("================== getProfileApi ========================")
  const { user } = profileResponse.data
  const customer: Customer = {
    id: user._id,
    name: user.name,
  }
  getLikesFirestore(user._id, moment())
  const newLike: Like = {
    userId: "5980deb74a75f5b45fb118ee",
    likeUrl: "test image url ",
    createdDate: Timestamp.now(),
  }
  addLikeFirestore(newLike, customer)
}
// main funciton just for testing
// const main = async (customerXlsData: CustomerXlsData) => {
//   await sleep()
//   return customerXlsData.name
// }

module.exports = { main }

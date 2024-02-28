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
  intervalForever,
  timeBetween,
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
import { info } from "@/api/firestore/info/interfaces"
import moment from "moment"
// import { getAdmin } from "@/firebaseAdmin"
import { addInfoServer } from "@/api/firestore/info/addInfoServer"

import { Message } from "@/api/firestore/message/interfaces"
import { isCustomerExistServer } from "@/api/firestore/customer/isCustomerExistServer"
import { addCustomerServer } from "@/api/firestore/customer/addCustomerServer"
import { addLikeServer } from "@/api/firestore/like/addLikeServer"
import { Like } from "@/api/firestore/like/interfaces"
import { addMessageCountServer } from "@/api/firestore/message/addMessageCountServer"
import { getAdminDb } from "@/firebaseAdmin"

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
      addInfoServer({
        customerName: customer.name,
        data: `likeAll start`,
        type: infoTypes.FUNCTION,
      })

      addDataToTxt(actionsFolder, "functions.txt", `likeAll start`)

      await likeAll(customer, customerXlsData)
      addInfoServer({
        customerName: customer.name,
        data: `likeAll end`,
        type: infoTypes.FUNCTION,
      })

      addDataToTxt(actionsFolder, "functions.txt", `likeAll end`)
      addDataToTxt(actionsFolder, "functions.txt", `likeAutomation start`)
      addInfoServer({
        customerName: customer.name,
        data: `likeAutomation start`,
        type: infoTypes.FUNCTION,
      })

      await likeAutomation(customer, customerXlsData)
      addInfoServer({
        customerName: customer.name,
        data: `likeAutomation end`,
        type: infoTypes.FUNCTION,
      })

      addDataToTxt(actionsFolder, "functions.txt", `likeAutomation end`)
    }
    console.log({ isWithMessages })
    if (isWithMessages) {
      addDataToTxt(actionsFolder, "functions.txt", `messageAutomation start`)
      addInfoServer({
        customerName: customer.name,
        data: `messageAutomation start`,
        type: infoTypes.FUNCTION,
      })

      await messageAutomation(customer, customerXlsData, lang)
      addInfoServer({
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
    const errorFile = path.join(errorsFolder, "errors.txt")
    addInfoServer({
      customerName: error.customerName,
      data: error.message,
      type: infoTypes.ERROR,
    })

    addDataToTxt(errorFile, "", errStr)
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

// const main = async () => {
//   // addInfoServer({
//   //   customerName: "M MAN on fthe world ",
//   //   data: `lst s the king`,
//   //   type: infoTypes.FUNCTION,
//   // })

//   const customer: Customer = {
//     id: "5980deb74a75f5b45fb118ee",
//     name: "lee",
//   }
//   const newMessage: Message = {
//     userId: customer.id,
//     amount: 4,
//     createdDate: Timestamp.now(),
//   }
//   // addCustomerServer(customer)
//   const newLike: Like = {
//     userId: customer.id,
//     likeUrl: "firstImage",
//     createdDate: Timestamp.now(),
//   }
//   // addLikeServer(newLike, customer)
//   addMessageCountServer(newMessage, customer)
//   // const exssts = await isCustomerExistServer("5980deb74a75f5b45fb118ee")
//   // console.log(exssts)
// }
const mainIteration = (customerXlsData: CustomerXlsData) => {
  intervalForever(() => main(customerXlsData), timeBetween.SESSION_USERS)
  // main()
}
// const addInfo = () => {
//   try {
//     const info: info = {
//       customerName: "customer.name",
//       data: "firstImage",
//       type: infoTypes.LIKE,
//     }
//     addInfoServer(info)
//   } catch (error) {
//     console.log(error)
//   }
// }
// const main = async (customerXlsData: CustomerXlsData) => {
//   try {
//     // const { token } = customerXlsData
//     // console.log("================== START_MAIN ========================")

//     // const profileResponse = await getProfileApi(token)
//     // const { travel, user } = profileResponse.data
//     // console.log(travel, user)
//     // return { travel, user }
//     addInfo()
//   } catch (error) {
//     console.log(error)
//   }
// }

module.exports = { mainIteration }

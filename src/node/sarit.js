// const { timeBetween } = require("@/util")
// const { likeUserApi } = require("./api")
// const { getProfileApi, getRecsApi, passUserApi } = require("./api")
// const { getDate, sleep } = require("./util")
// const { v4: uuidv4 } = require("uuid")
// const { getRecs } = require("./getRecs")
// const path = require("path")
// const { swipesFolder } = require("@/util")
// const { handleLike } = require("./handleLike")
// const { handlePass } = require("./handlePass")
// const { likeAutomation } = require("./likeAutomation")
// const { isGoodFit } = require("./isGoodFit")

// import { messagesFolder } from "@/pages/api/util"
const fs = require("fs")
const path = require("path")

// let likes = 0
// let passes = 0

// // customize
// const recIterationLike = async (customer, customerXlsData) => {
//   const { token, lookFor, isLookGood } = customerXlsData

//   const recs = await getRecs(token)

//   const folderName = customer.name
//   const pathUrl = path.join(swipesFolder, folderName)

//   for (const rec of recs) {
//     const isFit = await isGoodFit(rec.user, customerXlsData)
//     const firstImage = rec.user.photos?.[0]?.url

//     if (isFit) {
//       console.log("HOT")
//       likes++
//       if (likes === LIKE_LIM) return
//       await handleLike(token, rec, pathUrl, customer, firstImage)
//     } else {
//       passes++
//       await handlePass(token, rec, pathUrl, firstImage)
//     }

//     await sleep(timeBetween.GET_RECS)
//   }

//   console.log({ likes, passes })
// }
// const passAutomation = async (customer) => {
//   const { token, lookFor, isLookGood } = customerXlsData

//   const recs = await getRecs(token)

//   const folderName = customer.name
//   const passPath = path.join(swipesFolder, folderName, "pass.txt")

//   for (const rec of recs) {
//     const firstImage = rec.user.photos?.[0]?.url

//     passes++
//     await handlePass(token, rec, passPath, firstImage)

//     await sleep(timeBetween.GET_RECS)
//   }

//   console.log({ likes, passes })
// }

// const main = async () => {
//   const profileResponse = await getProfileApi(customerXlsData.token)
//   const { user } = profileResponse.data

//   const customer = {
//     id: user._id,
//     name: user.name,
//   }

//   while (likes < LIKE_LIM && passes + likes < SWIPE_LIM) {
//     await recIterationLike(customer, customerXlsData)
//     await sleep(timeBetween.LIKE_LOOP)
//   }
//   await passAutomation(customer)
// }

// const SWIPE_LIM = 500
// const LIKE_LIM = 100

// const customerXlsData = {
//   name: "sarit",
//   token: "fe7ac4b6-0619-45b3-b119-1ae5c32f4c0b",
//   lookFor: "relationship",
//   isLookGood: 0,
//   isWithLikes: 1,
//   isWithMessages: 0,
//   isProcess: 0,
// }
// main(customerXlsData)
// //  need to check that
const infoUrl = "./src/node/info"

const messagesFolder = path.join(infoUrl, "message")

const addDataToTxt = (folderPath, fileName, txt) => {
  // createFolder(folderPath)
  const filePath = path.join(folderPath, fileName)

  fs.appendFile(filePath, "txt" + "\n", (err) => {
    if (err) {
      console.error("Error appending data to the file:", err)
    } else {
      console.log("Data successfully appended to the file!")
    }
  })
}
// addDataToTxt(messagesFolder, "messages.txt", "message")

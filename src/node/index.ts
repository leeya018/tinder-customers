import { addLikeFirestore, addMessageCountFirestore } from "@/api/firestore"
import { Customer } from "@/api/firestore/customer/interfaces"
import { Like } from "@/api/firestore/like/interfaces"
import { Message } from "@/api/firestore/message/interfaces"
import {
  fileStarterNames,
  lookForOptions,
  relationshipWords,
  sexWords,
  transWords,
} from "@/util"
import { Timestamp } from "firebase/firestore"
import { passUserWithMatchApi } from "./api"
import { getDataFromGptApi } from "@/lib/api"
import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"

const {
  getRecsApi,
  likeUserApi,
  passUserApi,
  getRandomMessage,
  sendMessageApi,
  getMatchesApi,
  getMyLikesApi,
  addArrDataToTxt,
} = require("./api")

const { v4: uuidv4 } = require("uuid")
const { getDate, sleep, getToken, convertPrediction } = require("./util")

const { model, predict } = require("./modelCreate")

const { getProfileApi } = require("./api")

let likes = 0
let passes = 0
const likesLimit = 100
const daysForDel = 8
const waitTime = 10000
const second = 1000

const payloadLike = (s_number: string) => ({
  s_number,
  user_traveling: 1,
  liked_content_type: "photo",
  liked_content_id: uuidv4(),
})

const likeAll = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  // console.log("==================LIKEALL========================")
  const { token, lookFor } = customerXlsData
  try {
    const recs = await getMyLikesApi(token) // GET ALL LIKES FROM WOMEN
    console.log("recs len: " + recs.length)
    let i = 0
    for (const rec of recs) {
      console.log("rec num " + i)
      i++
      // console.log(rec.user)
      // console.log(rec.user._id, rec.s_number)
      const isFit = await isGoodFit(rec.user, customerXlsData)
      console.log({
        name: rec.user.name,
        lookFor: lookFor,
        isFit,
      })
      if (isFit) {
        await likeUserApi(token, rec.user, payloadLike(rec.s_number))
      } else {
        console.log("pass user should happend")
        // await passUserWithMatchApi(token, rec.user, rec.s_number, 1)
        console.log("pass user done")
      }
      console.log("out of rec loop")
      const firstImage = rec.user.photos.map((photos: any) => photos.url)[0]

      const newLike: Like = {
        userId: customer.id,
        likeUrl: firstImage,
        createdDate: Timestamp.now(),
      }
      await addLikeFirestore(newLike, customer)
      console.log("like user id : " + rec.user._id)
      await sleep()
    }
  } catch (error) {
    console.log(error.message)
  }
}

// let counter = 0
const getIsLookForFit = (lookFor: string, user: any) => {
  let wordsIncludes = []
  console.log({ lookFor })
  switch (lookFor) {
    case lookForOptions.trans: {
      wordsIncludes = transWords.filter((word) =>
        user.bio.toLowerCase().includes(word)
      )
      if (wordsIncludes.length > 0) {
        console.log("trans fit===>")
      } else {
        console.log("not trans fit===>")
      }
      break
    }
    case lookForOptions.relationship: {
      const pref = user.relationship_intent?.body_text || ""
      console.log({ pref })
      wordsIncludes = relationshipWords.filter((choice) => choice === pref)
      if (wordsIncludes.length > 0) {
        console.log("relationship fit===>")
      } else {
        console.log("not relationship fit===>")
      }
      break
    }
    case lookForOptions.sex: {
      const pref = user.relationship_intent?.body_text || ""
      console.log({ pref })
      wordsIncludes = sexWords.filter((choice) => choice === pref)
      if (wordsIncludes.length > 0) {
        console.log("sex fit===>")
      } else {
        console.log("not sex fit===>")
      }
      break
    }
    default:
      console.log("this optiosn is not exists")
      throw new Error("this optiosn is not exists")
  }
  return wordsIncludes.length > 0
}
const isGoodFit = async (user: any, customerXlsData: CustomerXlsData) => {
  // console.log({ rec })
  const { lookFor, isLookGood } = customerXlsData
  const photoUrls = user.photos.map((photos: any) => photos.url)
  const firstUrlImage = photoUrls[0]
  const prediction = await predict(firstUrlImage)

  const pred = convertPrediction(prediction)
  const randNum = Math.random()
  const bio = user.bio
  // console.log({ bio })
  const isFitPref = getIsLookForFit(lookFor, user)
  console.log({ isLookGood })
  return isLookGood ? isFitPref && pred.like > 0.4 : isFitPref
}
const iterateRecs = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  const { token, lookFor, isLookGood } = customerXlsData
  let res = null
  do {
    res = await getRecsApi(token)
    await sleep(8000)
  } while (!res || !res?.data || res?.data?.results?.length < 0)
  console.log({ res })
  console.log("amount of recs : " + res.data?.results?.length)
  if (
    !res.data ||
    res.data?.results === undefined ||
    res.data?.results.length === 0
  ) {
    await sleep(waitTime)
  }
  const recs = res.data.results || []
  let res1
  for (const rec of recs) {
    if (likes > likesLimit) return

    try {
      // console.log(pred)
      // if (convertPrediction(prediction).like > 0.5) {
      const isFit = await isGoodFit(rec.user, customerXlsData)
      if (isFit) {
        // if (randNum > 0.3) {
        console.log("HHHHHHHHHOOOOOOOOOOOOOOOOOOTTTTTTTTTTTTTTTTTTTTTTTT")
        likes++
        res1 = await likeUserApi(token, rec.user, payloadLike(rec.s_number))
        const firstImage = rec.user.photos.map((photos: any) => photos.url)[0]

        const newLike: Like = {
          userId: customer.id,
          likeUrl: firstImage,
          createdDate: Timestamp.now(),
        }
        await addLikeFirestore(newLike, customer)
        console.log("LIKE USER : " + rec.user._id)
      } else {
        passes++
        res1 = await passUserApi(token, rec.user, rec.s_number, 1)
        console.log("PASS USER : " + rec.user._id)
      }
    } catch (error: any) {
      console.log("iterateRecs function ", error.message)
    }
    await sleep()
  }
  console.log({ likes, passes })
}

const likeAutomation = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  console.log("==================LIKE_AUTOMATION========================")
  while (likes < likesLimit && passes + likes < 100) {
    await iterateRecs(customer, customerXlsData)
  }
  console.log({ likes, passes })
}

const messageAutomation = async (
  customer: Customer,
  customerXlsData: CustomerXlsData,
  lang: string
) => {
  console.log("==================MESSAGE_AUTOMATION========================")
  const { token } = customerXlsData
  console.log({ customer })
  const paylod = {
    message: 0,
    amount: 60,
    is_tinder_u: true,
  }
  try {
    const res = await getMatchesApi(token, paylod)

    const matches = res.data?.matches
    console.log("matches len: ", matches.length)
    console.log("message automation: ", lang)
    for (const match of matches) {
      console.log("I am in the for===>")
      const fileStarterName =
        fileStarterNames[lang.toLowerCase()] || fileStarterNames.english
      console.log({ fileStarterName })
      const message = getRandomMessage(fileStarterName)
      console.log({ message })
      const payloadMessage = {
        userId: customer.id,
        otherId: match?.person._id,
        matchId: match?.id,
        sessionId: null,
        message,
      }
      console.log(payloadMessage)
      const res = await sendMessageApi(token, payloadMessage)
      const newMessage: Message = {
        userId: customer.id,
        amount: 1,
        createdDate: Timestamp.now(),
      }
      await addMessageCountFirestore(newMessage, customer)
      console.log("MESSAGE: " + message + "TO : " + match.person._id)
      await sleep()
    }
  } catch (error: any) {
    console.log(error.message)
  }
}

const intervalForever = async (callback: Function, rate: number) => {
  let intervalNum = 0
  while (true) {
    intervalNum++
    console.log(`interval ${callback.name}: ${intervalNum}  ${getDate()}`)
    await callback()

    await sleep(rate)
  }
}

const test = async (token: string) => {
  const res = await getProfileApi(token)
  const myProfileId = res.data.user._id

  console.log({ user: res.data.user })
  const name = res.data.user.name

  const customer: Customer = {
    id: myProfileId,
    name,
  }
  const newLike: Like = {
    userId: myProfileId,
    likeUrl: "firstImage2/3324",
    createdDate: Timestamp.now(),
  }
  const newMessage: Message = {
    userId: myProfileId,
    amount: 1,
    createdDate: Timestamp.now(),
  }
  // await addLikeFirestore(newLike, customer)
  await addMessageCountFirestore(newMessage, customer)
}
// I can do setIntrval for each one , every time the dist betwen the operations
const main = async (customerXlsData: CustomerXlsData) => {
  const minute = 1000 * 60
  const hour = 1000 * 60 * 60
  const day = hour * 24
  const week = day * 7
  const second = 1000

  const { token, lookFor, isLookGood } = customerXlsData
  try {
    // process.env.NEXT_PUBLIC_X_AUTH_TOKEN = "";
    // console.log(process.env.NEXT_PUBLIC_X_AUTH_TOKEN)

    console.log("==================START_MAIN========================")

    // intervalForever(updateToken, day); // each day updaet the token in file and then in the env
    // await sleep(minute);
    const res = await getProfileApi(token)
    // console.log({ profile: res.data })
    console.log({ isTraveling: res.data.travel?.is_traveling })
    console.log({ travelPos: res.data.travel?.travel_pos })
    console.log({ myPos: res.data.user.pos })

    const location = res.data.travel?.is_traveling
      ? res.data.travel.travel_pos
      : res.data.user.pos
    const question = `what is the speaking language in ${JSON.stringify(
      location
    )} in 1 word only`
    console.log({ question })
    const lang = await getDataFromGptApi(question)
    console.log({ lang })
    // console.log(res.data.user)
    const { _id, name } = res.data.user

    const customer: Customer = {
      id: _id,
      name,
    }
    console.log(customer)
    intervalForever(() => likeAll(customer, customerXlsData), day / 2)
    intervalForever(() => likeAutomation(customer, customerXlsData), day / 10)
    intervalForever(
      () => messageAutomation(customer, customerXlsData, lang),
      day / 2
    )

    console.log("==================END_MAIN========================")
    // console.log(res.data.user)
    return res.data.user.name
  } catch (error) {
    console.log(error.message)
  }
}

// async function imagesConv(sourcePath, outputPath) {
//   let imgUrls = readImagesFromTxt(sourcePath)
//   imgUrls = [...new Set(imgUrls)]
//   console.log(imgUrls)
//   let i = 6300
//   for (const url of imgUrls.reverse()) {
//     await fromUrlToImage(url, outputPath + `\\${i}.png`)
//     i++
//   }
// }
// fromUrlToImage(
//   "https://images-ssl.gotinder.com/u/2Xfc6kHVbAR5GU87XdHCxk/7KZcgHSS6CHirA7EinGSog.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS8yWGZjNmtIVmJBUjVHVTg3WGRIQ3hrLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTcwMzU0ODl9fX1dfQ__&Signature=sItIC3OIn8RHFj0fQPrqIrQN476SwbAQ3ZVoTU6iTN5tn6Bk9rr6W4c8zRjGB5hpBuFCRNQgXc6AkZ2Xw6rN7Dlr8pFFutwXugNs0CF2gBc~jCF8X9Yva4cb5V-XAXMZHsxJGcfn3~kWaUGWnnSjWcGVNH~LpxiGGfkbqVZDiwNu07h8SB7PJLcUTqJa8in3JgsTxfcK-z1sxsbs~PO73mRatn63lm-3S4p4Qm8-pqZFyWp7fi081scriV~5Lz-4yGYTQxORPUDZ~wfMtCoSm7TfVm9Wxjt9Xu1JjQSXA0~R~0tPGpcU6Gaxk4-xlESIPkP01v2m-2xf7RAwOYXcNQ__&Key-Pair-Id=K368TLDEUPA6OI",
//   "C:\\Users\\user\\Downloads\\tensor\\like\\1.png"
// );
const sourceLikes = "../tensorFolder/like.txt"
const sourcePass = "../tensorFolder/pass.txt"
const sourceAll = "../tensorFolder/all.txt"
const outputLike = "C:\\Users\\user\\Documents\\tinder-tensor\\like"
const outputPass = "C:\\Users\\user\\Documents\\tinder-tensor\\pass"
const outputAll = "C:\\Users\\user\\Documents\\tinder-tensor\\all"

// const o = "../tensorFolder/like1.txt";

// const outputL1 = "C:\\Users\\user\\Downloads\\tensor\\l1";

// imagesConv(sourceLikes, outputLike);
// imagesConv(sourcePass, outputPass);
// start(l, o);

// main()
module.exports = { main, test }

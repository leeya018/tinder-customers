import { Timestamp } from "firebase/firestore"
import moment from "moment"
import {
  addArrDataToTxt,
  getMatchesApi,
  getMyLikesApi,
  getRandomMessage,
  getRecsApi,
  likeUserApi,
  passUserApi,
  sendMessageApi,
} from "./lib/api"
// import { addArrDataToTxt, getRandomMessage } from "./node/helper"

const { v4: uuidv4 } = require("uuid")
const { model, predict } = require("@/lib/modelCreate")

export const NavNames = {
  home: "home",
  commonQuestions: "commonQuestions",
  products: "products",
  login: "login",
  root: "",
}

const sleep = (waitTime = null) => {
  const time = waitTime ? waitTime : (Math.random() * 3 + 1) * 1000
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      return resolve("done")
    }, time)
  })
}

export const getUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BASIC_URL
    : process.env.NEXT_PUBLIC_BASIC_URL_PRODUCTION
}

export const isDev = () => process.env.NODE_ENV === "development"

const getDate = () => {
  // add 3 hours for the isreal time zone
  const miliseconds = new Date().getTime() + +3 * 60 * 60 * 1000
  return new Date(miliseconds).toISOString()
}

const minute = 1000 * 60
const hour = 1000 * 60 * 60
export const day = hour * 24
const week = day * 7
const second = 1000

let likes = 0
let passes = 0
const likesLimit = 100
const daysForDel = 8
const waitTime = 10000

export const intervalForever = async (callback: Function, rate: number) => {
  let intervalNum = 0
  while (true) {
    intervalNum++
    console.log(`interval ${callback.name}: ${intervalNum}  ${getDate()}`)
    await callback()

    await sleep(rate)
  }
}

const payloadLike = (s_number: number) => ({
  s_number,
  user_traveling: 1,
  liked_content_type: "photo",
  liked_content_id: uuidv4(),
})

export const likeAll = async () => {
  console.log("==================LIKEALL========================")
  const recs = await getMyLikesApi() // GET ALL LIKES FROM WOMEN
  for (const rec of recs) {
    // console.log(rec.user);
    console.log(rec.user._id, rec.s_number)
    let res1 = await likeUserApi(rec.user, payloadLike(rec.s_number))
    console.log("like user id : " + rec.user._id)
    await sleep()
  }
}

const convertPrediction = (prediction) => {
  try {
    const result = prediction.reduce((acc, item) => {
      acc[item.class] = item.score
      return acc
    }, {})
    return result
  } catch (error) {
    console.log("convertPrediction function", error.message)
  }
}

const isGoodFit = async (rec: any) => {
  // console.log({ rec })
  const user = rec.user
  const photoUrls = user.photos.map((photos: any) => photos.url)
  const firstUrlImage = photoUrls[0]
  const prediction = await predict(firstUrlImage)
  // console.log("convertPrediction(prediction)")
  const pred = convertPrediction(prediction)
  const randNum = Math.random()
  const bio = rec.user.bio
  console.log({ bio })
  // const desc =
  const fitWords = [
    "trans",
    "transgender",
    "ladyboy",
    "טרנס",
    "טראנס",
    "shemale",
  ]

  const wordsIncludes = fitWords.filter((word) =>
    bio.toLowerCase().includes(word)
  )
  const isBioFit = wordsIncludes.length > 0
  if (isBioFit) {
    // let photoUrlsTxt = photoUrls.map((url) => url + "/n")
    // photoUrlsTxt + bio + "/n/n/n"
    console.log(photoUrls)
    addArrDataToTxt("../tensorFolder/bio.txt", photoUrls, bio)
  }
  // return isBioFit || pred.like > 0.4 || randNum > 0.4
  return isBioFit || pred.like > 0.4
  // return isBioFit
}

const iterateRecs = async () => {
  let res = null
  do {
    res = await getRecsApi()
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

    // console.log(user.photos);
    // console.log({ firstUrlImage })
    try {
      // console.log(pred)
      // if (convertPrediction(prediction).like > 0.5) {
      const isFit = await isGoodFit(rec)
      if (isFit) {
        // if (randNum > 0.3) {
        console.log("HHHHHHHHHOOOOOOOOOOOOOOOOOOTTTTTTTTTTTTTTTTTTTTTTTT")
        likes++
        res1 = await likeUserApi(rec.user, payloadLike(rec.s_number))
        console.log("LIKE USER : " + rec.user._id)
      } else {
        passes++
        res1 = await passUserApi(rec.user, rec.s_number, 1)
        console.log("PASS USER : " + rec.user._id)
      }
    } catch (error) {
      console.log("iterateRecs function ", error.message)
    }
    await sleep()
  }
  console.log({ likes, passes })
}

export const likeAutomation = async () => {
  console.log("==================LIKE_AUTOMATION========================")
  while (likes < likesLimit && passes + likes < 100) {
    await iterateRecs()
  }
  console.log({ likes, passes })
}

export const messageAutomation = async () => {
  console.log("==================MESSAGE_AUTOMATION========================")
  const paylod = {
    message: 0,
    amount: 60,
    is_tinder_u: true,
  }
  try {
    const res = await getMatchesApi(paylod)

    const matches = res.data?.matches
    for (const match of matches) {
      const message = getRandomMessage()

      const payloadMessage = {
        userId: process.env.NEXT_PUBLIC_MY_USER_ID,
        otherId: match?.person._id,
        matchId: match?.id,
        sessionId: null,
        message,
      }
      console.log(payloadMessage)
      const res = await sendMessageApi(payloadMessage)
      console.log("MESSAGE: " + message + "TO : " + match.person._id)
      await sleep()
    }
  } catch (error) {
    console.log(error.message)
  }
}

export const modals = {
  message: "message",
}

export const instructions = [
  "auto likes for you so you will not have to waist times. ( by Machine learning it will already choose for you )",
  "auto message for all the matches , so you will not need to think what to send them for the first time ( all you have to do is just to continue typing with the women who already answer for the first message). ",
  "it will like back all the women who already liked you , so you will not have to do it by your self",
  "it can find a match according to search words that you want  it to look for in the bio",
]

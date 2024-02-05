import {
  getRecsApi,
  likeUserApi,
  passUserApi,
  getRandomMessage,
  sendMessageApi,
  getMatchesApi,
  getMyLikesApi,
  unmatchUsersApi,
  getMessagesApi,
  getRateBeautifulApi,
  getImagesApi,
  fromUrlToImage,
  readImagesFromTxt,
  addDataToTxt,
  addArrDataToTxt,
} from "./api"
import { autoPilotMessaging } from "./helper"

import { uuid } from "uuidv4"
import { getDate, sleep, getToken, convertPrediction } from "./util"

require("dotenv").config()

const { spawn } = require("child_process")
const fs = require("fs")
import { model, predict } from "./modelCreate"

let likes = 0
let passes = 0
const likesLimit = 100
const daysForDel = 8
const waitTime = 10000
const second = 1000

const payloadLike = (s_number) => ({
  s_number,
  user_traveling: 1,
  liked_content_type: "photo",
  liked_content_id: uuid(),
})

const likeAll = async () => {
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

let counter = 0

const isGoodFit = async (rec) => {
  // console.log({ rec })
  const user = rec.user
  const photoUrls = user.photos.map((photos) => photos.url)
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

const likeAutomation = async () => {
  console.log("==================LIKE_AUTOMATION========================")
  while (likes < likesLimit && passes + likes < 100) {
    await iterateRecs()
  }
  console.log({ likes, passes })
}

const messageAutomation = async () => {
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

const unmatchAll = async () => {
  const paylod = {
    message: 0,
    amount: 30,
    is_tinder_u: true,
  }

  const res = await getMatchesApi(paylod)
  let c = 0
  const matches = res.data.matches
  for (const match of matches) {
    // if (diffInDays > daysForDel) {

    c++
    await unmatchUsersApi(match._id)
    console.log("DELETE MATCH ID : " + match._id)

    await sleep()
  }
  console.log("total DETETED MATCHES: " + c)
}
const unmatchNotResponseMatches = async () => {
  const paylod = {
    message: 1,
    amount: 100,
    is_tinder_u: true,
  }

  const res = await getMatchesApi(paylod)
  let c = 0
  const matches = res.data.matches
  for (const match of matches) {
    const diffInMs = new Date(match.created_date) - new Date()
    const diffInDays = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60 * 24)))
    const messages = await getMessagesApi(match._id)
    console.log(diffInDays + " > " + daysForDel)
    // if (diffInDays > daysForDel) {
    if (diffInDays > daysForDel && messages.length === 1) {
      c++
      await unmatchUsersApi(match._id)
      console.log("DELETE MATCH ID : " + match._id)
    }
    await sleep()
  }
  console.log("total DETETED MATCHES: " + c)
}

const intervalForever = async (callback, rate) => {
  let intervalNum = 0
  while (true) {
    intervalNum++
    console.log(`interval ${callback.name}: ${intervalNum}  ${getDate()}`)
    await callback()

    await sleep(rate)
  }
}

const updateToken = async () => {
  const second = 1000
  spawn("python", ["login.py"]) // update login in file
  await sleep(second * 10) // wait for it
  const token = await getToken() // get the token
  console.log("token", token)
  process.env.NEXT_PUBLIC_X_AUTH_TOKEN = token
  console.log("token is : ", process.env.NEXT_PUBLIC_X_AUTH_TOKEN)
}

// I can do setIntrval for each one , every time the dist betwen the operations
export const main = async () => {
  const minute = 1000 * 60
  const hour = 1000 * 60 * 60
  const day = hour * 24
  const week = day * 7
  const second = 1000
  // process.env.NEXT_PUBLIC_X_AUTH_TOKEN = "";
  console.log(process.env.NEXT_PUBLIC_X_AUTH_TOKEN)

  console.log("==================START_MAIN========================")

  // intervalForever(updateToken, day); // each day updaet the token in file and then in the env
  // await sleep(minute);

  intervalForever(likeAll, day / 2)
  intervalForever(likeAutomation, day / 10)
  intervalForever(messageAutomation, day / 2)

  // intervalForever(autoPilotMessaging, day / 5);
  // autoPilotMessaging();
  // await sleep(minute);
  // await sleep(minute);
  // await sleep(minute);
  // intervalForever(unmatchNotResponseMatches, day)
  // unmatchAll()
  // await sleep(minute);

  // intervalForever(updateToken, day); // each day updaet the token in file and then in the env

  // await likeAll(); // LIKE THEM ALL
  // await getImagesApi(); // DO THE LIKES TO THE LIMIT
  // getRateBeautifulApi();
  // await messageAutomation(); //  DO THE MESSAGES FROM WHAT YOU HAVE
  // await unmatchNotResponseMatches(); // REMOVE THE MATCHES THAT NOT RESPOND

  // addDataToTxt('liked.txt')
  // addDataToTxt('disLiked.txt')

  // getImagesApi();

  console.log("==================END_MAIN========================")

  console.log("Press Ctrl+C to exit")

  // process.stdin.resume();
}

async function imagesConv(sourcePath, outputPath) {
  let imgUrls = readImagesFromTxt(sourcePath)
  imgUrls = [...new Set(imgUrls)]
  console.log(imgUrls)
  let i = 6300
  for (const url of imgUrls.reverse()) {
    await fromUrlToImage(url, outputPath + `\\${i}.png`)
    i++
  }
}
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

export const function1 = () => {
  return "C:\\Users\\user\\Documents\\tinder"
}

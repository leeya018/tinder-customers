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

import { getDataFromGptApi } from "@/api_client"
import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"

const {
  getRecsApi,
  likeUserApi,
  passUserApi,
  getRandomMessage,
  sendMessageApi,
  getMatchesApi,
  getMyLikesApi,
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
  const { token, lookFor } = customerXlsData

  const recs = await getMyLikesApi(token)
  console.log("Total recommendations:", recs.length)

  for (let i = 0; i < recs.length; i++) {
    const rec = recs[i]
    console.log(`Processing recommendation ${i + 1}...`)
    const isFit = await isGoodFit(rec.user, customerXlsData)
    console.log(`User: ${rec.user.name}, LookFor: ${lookFor}, IsFit: ${isFit}`)

    if (isFit) {
      await likeUserApi(token, rec.user, payloadLike(rec.s_number))
      console.log(`Liked user: ${rec.user._id}`)
    } else {
      console.log("Passed user.")
      // Uncomment the next line if you want to pass users who are not a good fit
      // await passUserWithMatchApi(token, rec.user, rec.s_number, 1);
    }

    const firstImage = rec.user.photos[0]?.url || "No image"
    const newLike: Like = {
      userId: customer.id,
      likeUrl: firstImage,
      createdDate: Timestamp.now(),
    }
    await addLikeFirestore(newLike, customer)
    await sleep()
  }
}

interface User {
  bio: string
  relationship_intent?: {
    body_text: string
  }
}

const getIsLookForFit = (lookFor: string, user: User): boolean => {
  console.log("Looking for:", lookFor)

  switch (lookFor) {
    case lookForOptions.trans: {
      let wordsIncludes = transWords.filter((word) =>
        user.bio.toLowerCase().includes(word)
      )
      console.log(wordsIncludes.length > 0 ? "Trans fit." : "Not trans fit.")
      return wordsIncludes.length > 0
    }
    case lookForOptions.relationship:
    case lookForOptions.sex: {
      const pref = user.relationship_intent?.body_text || ""
      console.log("Preference:", pref)
      const wordsList =
        lookFor === lookForOptions.relationship ? relationshipWords : sexWords
      let wordsIncludes = wordsList.filter((choice) => choice === pref)
      console.log(
        wordsIncludes.length > 0 ? `${lookFor} fit.` : `Not ${lookFor} fit.`
      )
      return wordsIncludes.length > 0
    }
    default:
      throw new Error("Unsupported option: " + lookFor)
  }
}

const isGoodFit = async (user: any, customerXlsData: CustomerXlsData) => {
  const { lookFor, isLookGood } = customerXlsData
  const firstPhotoUrl = user.photos[0]?.url

  if (!firstPhotoUrl) {
    console.error("User has no photos.")
    return false
  }

  let likePred = 1
  try {
    if (isLookGood && firstPhotoUrl) {
      const prediction = await predict(firstPhotoUrl)
      const pred = convertPrediction(prediction)
      console.log({ pred })
      likePred = pred.like
    }
    const isFitPref = getIsLookForFit(lookFor, user)

    return isFitPref && likePred > 0.4
  } catch (error) {
    console.error(
      "Error in isGoodFit:",
      error instanceof Error ? error.message : error
    )
    return false
  }
}

const recIterationLike = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  const { token, lookFor, isLookGood } = customerXlsData
  let res = null
  do {
    res = await getRecsApi(token)
    await sleep(8)
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
      const isFit = await isGoodFit(rec.user, customerXlsData)
      if (isFit) {
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
      await sleep(5)
    } catch (error: any) {
      throw new Error("recIterationLike function ", error.message)
    }
  }
  console.log({ likes, passes })
}

const likeAutomation = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  console.log("==================LIKE_AUTOMATION========================")
  while (likes < likesLimit && passes + likes < 70) {
    await recIterationLike(customer, customerXlsData)
    await sleep(5)
  }
  console.log({ likes, passes })
}

const messageAutomation = async (
  customer: Customer,
  customerXlsData: CustomerXlsData,
  lang: string
) => {
  console.log("================== MESSAGE_AUTOMATION ========================")
  const { token } = customerXlsData
  console.log("Customer:", customer)
  const payload = {
    message: 0,
    amount: 60,
    is_tinder_u: true,
  }

  try {
    const res = await getMatchesApi(token, payload)
    const matches = res.data?.matches
    console.log("Matches count:", matches.length)
    console.log("Message automation language:", lang)

    for (const match of matches) {
      const fileStarterName =
        fileStarterNames[lang.toLowerCase()] || fileStarterNames.english
      const message = getRandomMessage(fileStarterName)
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
      await addMessageCountFirestore(newMessage, customer)
      await sleep()
    }
  } catch (error: any) {
    console.log(error.message)
    throw error
  }
}

// the real main function
const main = async (customerXlsData: CustomerXlsData) => {
  const hour = 60 * 60
  const day = hour * 24

  const { token, isWithMessages, isWithLikes } = customerXlsData
  try {
    console.log("================== START_MAIN ========================")

    const profileResponse = await getProfileApi(token)
    const { travel, user } = profileResponse.data
    const isTraveling = travel?.is_traveling
    const location = isTraveling ? travel.travel_pos : user.pos
    console.log({ isTraveling, travelPos: travel?.travel_pos, myPos: user.pos })

    const question = `What is the speaking language in ${JSON.stringify(
      location
    )} in 1 word only`
    console.log({ question })
    const lang = await getDataFromGptApi(question)
    console.log({ lang })

    const customer: Customer = {
      id: user._id,
      name: user.name,
    }
    console.log("Customer:", customer)

    if (isWithLikes) {
      await likeAll(customer, customerXlsData)
      await likeAutomation(customer, customerXlsData)
    }

    if (isWithMessages) {
      await messageAutomation(customer, customerXlsData, lang)
    }

    console.log("================== END_MAIN ========================")
    return user.name
  } catch (error) {
    console.log(error.message)
  }
}

// main funciton just for testing
// const main = async (customerXlsData: CustomerXlsData) => {
//   await sleep()
//   return customerXlsData.name
// }

module.exports = { main }

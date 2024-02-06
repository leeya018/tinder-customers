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

const payloadLike = (s_number) => ({
  s_number,
  user_traveling: 1,
  liked_content_type: "photo",
  liked_content_id: uuidv4(),
})

const likeAll = async (token) => {
  // console.log("==================LIKEALL========================")
  const recs = await getMyLikesApi(token) // GET ALL LIKES FROM WOMEN
  for (const rec of recs) {
    console.log(rec.user)
    console.log(rec.user._id, rec.s_number)
    let res1 = await likeUserApi(token, rec.user, payloadLike(rec.s_number))
    console.log("like user id : " + rec.user._id)
    await sleep()
  }
}

// let counter = 0

const isGoodFit = async (token, rec) => {
  // console.log({ rec })
  const user = rec.user
  const photoUrls = user.photos.map((photos) => photos.url)
  const firstUrlImage = photoUrls[0]
  const prediction = await predict(firstUrlImage)

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
    // addArrDataToTxt("./tensorFolder/bio.txt", photoUrls, bio)
  }
  // return isBioFit || pred.like > 0.4 || randNum > 0.4
  // return isBioFit || randNum > 0.4
  return isBioFit || pred.like > 0.4
  // return isBioFit
}
const iterateRecs = async (token) => {
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
    // console.log(user.photos);
    // console.log({ firstUrlImage })
    try {
      // console.log(pred)
      // if (convertPrediction(prediction).like > 0.5) {
      const isFit = await isGoodFit(token, rec)
      if (isFit) {
        // if (randNum > 0.3) {
        console.log("HHHHHHHHHOOOOOOOOOOOOOOOOOOTTTTTTTTTTTTTTTTTTTTTTTT")
        likes++
        res1 = await likeUserApi(token, rec.user, payloadLike(rec.s_number))
        console.log("LIKE USER : " + rec.user._id)
      } else {
        passes++
        res1 = await passUserApi(token, rec.user, rec.s_number, 1)
        console.log("PASS USER : " + rec.user._id)
      }
    } catch (error) {
      console.log("iterateRecs function ", error.message)
    }
    await sleep()
  }
  console.log({ likes, passes })
}

const likeAutomation = async (token) => {
  console.log("==================LIKE_AUTOMATION========================")
  while (likes < likesLimit && passes + likes < 100) {
    await iterateRecs(token)
  }
  console.log({ likes, passes })
}

const messageAutomation = async (token, myProfileId) => {
  console.log("==================MESSAGE_AUTOMATION========================")
  console.log({ myProfileId })
  const paylod = {
    message: 0,
    amount: 60,
    is_tinder_u: true,
  }
  try {
    const res = await getMatchesApi(token, paylod)

    const matches = res.data?.matches
    for (const match of matches) {
      const message = getRandomMessage()

      const payloadMessage = {
        userId: myProfileId,
        otherId: match?.person._id,
        matchId: match?.id,
        sessionId: null,
        message,
      }
      console.log(payloadMessage)
      const res = await sendMessageApi(token, payloadMessage)
      console.log("MESSAGE: " + message + "TO : " + match.person._id)
      await sleep()
    }
  } catch (error) {
    console.log(error.message)
  }
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

// I can do setIntrval for each one , every time the dist betwen the operations
const main = async (token = "5728883c-d648-4aac-b9ca-64ce9daa8ff7") => {
  const minute = 1000 * 60
  const hour = 1000 * 60 * 60
  const day = hour * 24
  const week = day * 7
  const second = 1000
  // process.env.NEXT_PUBLIC_X_AUTH_TOKEN = "";
  // console.log(process.env.NEXT_PUBLIC_X_AUTH_TOKEN)

  console.log("==================START_MAIN========================")

  // intervalForever(updateToken, day); // each day updaet the token in file and then in the env
  // await sleep(minute);
  const res = await getProfileApi(token)
  // console.log(res.data.user)
  const myProfileId = res.data.user._id
  console.log(myProfileId)
  intervalForever(() => likeAll(token), day / 2)
  intervalForever(() => likeAutomation(token), day / 10)
  intervalForever(() => messageAutomation(token, myProfileId), day / 2)

  console.log("==================END_MAIN========================")
  // console.log(res.data.user)
  return res.data.user.name
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
module.exports = { main }

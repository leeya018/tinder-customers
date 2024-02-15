const { likeUserApi } = require("./api")
const { getProfileApi, getRecsApi, passUserApi } = require("./api")
const { getDate, sleep } = require("./util")
const { v4: uuidv4 } = require("uuid")

let likes = 0
let passes = 0
const randomLim = 0.03
const waitTime = 10000

const payloadLike = (s_number) => ({
  s_number,
  user_traveling: 1,
  liked_content_type: "photo",
  liked_content_id: uuidv4(),
})

const intervalForever = async (callback, rate) => {
  let intervalNum = 0
  while (true) {
    intervalNum++
    console.log(`interval ${callback.name}: ${intervalNum}  ${getDate()}`)
    await callback()
    await sleep(rate)
  }
}

const iterateRecs = async (token) => {
  let res = null
  try {
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

    for (const rec of recs) {
      console.log("iterateRecs")
      if (passes + likes > 100) return

      const rand = Math.random()
      if (rand < randomLim) {
        await likeUserApi(token, rec.user, payloadLike(rec.s_number))
        likes++
      } else {
        await passUserApi(token, rec.user, rec.s_number, 1)
        passes++
      }
      await sleep()
      console.log({ passes, likes })
    }
  } catch (err) {
    console.log(err.message)
  }
}
const passAllAutomation = async (token) => {
  while (passes + likes < 150) {
    await iterateRecs(token)
  }
}

const main = async (token) => {
  const hour = 1000 * 60 * 60
  const rand = Math.random() + 1
  const halfHR = (hour / 2) * rand

  try {
    const res = await getProfileApi(token)

    intervalForever(() => passAllAutomation(token), halfHR)

    console.log("==================END_MAIN========================")

    return res.data.user.name
  } catch (error) {
    console.log(error.message)
  }
  console.log("==================END_MAIN========================")
}

const myToken = "cabf0363-467b-4f05-90c2-4f16bac10f93"
main(myToken)

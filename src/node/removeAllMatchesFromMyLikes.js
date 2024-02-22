const { timeBetween } = require("@/util")
const { passUserWithMatchApi, getMyLikesApi } = require("./api")
const { sleep } = require("./util")

const intervalForever = async (callback, rate) => {
  let intervalNum = 0
  while (true) {
    intervalNum++
    console.log(`interval ${callback.name}: ${intervalNum} `)
    await callback()

    await sleep(rate)
  }
}
const removeMyLikes = async (token) => {
  const recs = await getMyLikesApi(token)
  console.log(recs.length)
  for (const rec of recs.slice(0, 20)) {
    console.log({ userId: rec.user._id })
    const data = await passUserWithMatchApi(token, rec.user, rec.s_number, 1)
    console.log({ status: data.status })
    await sleep(timeBetween.GET_RECS)
    console.log("done sleep")
  }
}
const minute = 1000 * 60

const token = "4d68f82e-b65c-4730-bc0e-32622c02e05d"
intervalForever(() => removeMyLikes(token), minute)

// you remove  all the likes that people have doe for you by dislike them

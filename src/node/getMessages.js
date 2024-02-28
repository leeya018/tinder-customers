const { sleep } = require("./util")
const { getMatchesApi, getProfileApi, getMessagesApi } = require("./api")

const { infoUrl } = require("@/util")
const path = require("path")
const { timeBetween } = require("@/util")
const { addDataToTxt } = require("@/pages/api/util")

const getMessages = async (token, matchId) => {
  try {
    const messagesArr = await getMessagesApi(token, matchId)
    // console.log(messagesArr)
    return messagesArr
  } catch (error) {
    console.log(error.message)
    console.log(error.response.data)
  }
}

const getMatches = async (token) => {
  const payload = {
    message: 1, //if there are messages in the pull
    amount: 10, // how many matches to return
    is_tinder_u: true,
  }
  const res = await getMatchesApi(token, payload)
  return res.data.matches
}

const token = "4d68f82e-b65c-4730-bc0e-32622c02e05d"
// const matchId = "5980deb74a75f5b45fb118ee6575d04d7c42750100d5892b"
// const myId = "5980deb74a75f5b45fb118ee"
const filePath = path.join(infoUrl, "messages.txt")

const main = async () => {
  let goodMessages = []
  const res = await getProfileApi(token)
  const myId = res.data.user._id
  const matches = await getMatches(token)
  const matchIds = matches.map((match) => match.id)
  console.log(matchIds)
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const messagesArr = await getMessages(token, match.id)
    const messages = messagesArr.map((msg) => {
      const { from, message } = msg
      const sender = from === myId ? "me" : "women"
      return {
        sender,
        message,
      }
    })
    if (messages.length > 7) {
      goodMessages.push(messages)
      addDataToTxt(filePath, JSON.stringify(messages))
    }
    console.log("amount of good messages " + goodMessages.length)
    console.log(`======================MESSAGE ${i}=================`)
    console.log(messages)
    await sleep(timeBetween.ENGAGEMENT)
  }

  console.log({ goodMessages })
}
main()
// you remove  all the likes that people have doe for you by dislike them

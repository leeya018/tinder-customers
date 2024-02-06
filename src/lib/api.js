const { default: axios } = require("axios")
// const { v4: uuidv4 } = require("uuid")

// export const generateMessageApi = async () => {
//   try {
//     const res = await axios.get(
//       `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/randomstarter`,
//       {
//         params: { lineNumber: -1 },
//       }
//     )
//     return res.data.trim()
//   } catch (error) {
//     console.log(error)
//   }
// }

// export const sendMessageApi = async (message, personId, matchId) => {
//   if (!message) return
//   const data = {
//     userId: process.env.NEXT_PUBLIC_MY_USER_ID,
//     otherId: personId,
//     matchId: matchId,
//     sessionId: null,
//     message,
//   }
//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/user/message`,
//     data
//   )
//   return res.data
// }

// export const getMessagesApi = async (matchId) => {
//   console.log(
//     "====================================================================="
//   )
//   const res = await axios.get(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/messages`,
//     {
//       params: { matchId },
//     }
//   )

//   console.log(res.data.data.messages)
//   return res.data.data.messages
// }
// // generateMessageGpt
// // const ifFirstMessage = (match) => {
// //   return match.messages.length === 0 && hasBio
// // }
// // generateMessageGpt
// const convertMessageArr = (arr) => {
//   const msgsArr = arr.map((msg) => ({
//     from: msg.from === process.env.NEXT_PUBLIC_MY_USER_ID ? "me" : "women",
//     to: msg.to === process.env.NEXT_PUBLIC_MY_USER_ID ? "me" : "women",
//     message: msg.message,
//   }))

//   return msgsArr
// }

// // export const generateMessageGptApi = async (match) => {
// //   if (ifFirstMessage(match)) {
// //     alert("first message")
// //   }
// //   const messages = await getMessagesApi(match.id)
// //   // let description = " I am the best in w  ";
// //   const msgsArr = convertMessageArr(messages)
// //   const msgs = match.messages
// //   let data = JSON.stringify({
// //     model: "text-davinci-003",
// //     prompt: `I am messaging a women  \n\n this is the array of messagse between us  :   \n\n   ${JSON.stringify(
// //       msgsArr
// //     )} \n\n
// //         . please give a good message to write according to the former messages
// //       }`,
// //     max_tokens: 1000,
// //   })

// //   let config = {
// //     method: "post",
// //     maxBodyLength: Infinity,
// //     url: "https://api.openai.com/v1/completions",
// //     headers: {
// //       Authorization: process.env.NEXT_PUBLIC_CHAT_GPT_TOKEN,
// //       "Content-Type": "application/json",
// //     },
// //     data: data,
// //   }

// //   return axios
// //     .request(config)
// //     .then((res) => {
// //       // console.log(res.data);
// //       return res.data.choices[0].text.trim()
// //     })
// //     .catch((error) => {
// //       console.log(error)
// //     })
// // }

// export const getMatchesApi = async (payload) => {
//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/matches`,
//     payload
//   )
//   return res.data.data.matches
// }
// export const getMatchesTokenApi = async (payload) => {
//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/matches`,
//     payload
//   )
//   return res.data.data
// }
// export const getRecsApi = async () => {
//   const res = await axios.get(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/recs`
//   )
//   return res.data.data.results
// }

// export const passUserApi = async (s_number, id, fast_match = 0) => {
//   // like user api
//   const params = {
//     id,
//     s_number,
//     user_traveling: 1,
//     fast_match,
//   }

//   const res = await axios.get(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/user/pass`,
//     {
//       params,
//     }
//   )
// }

// export const likeUserApi = async (s_number, id) => {
//   // like user api
//   // throw new Error("Not implemented");
//   const payload = {
//     s_number,
//     user_traveling: 1,
//     liked_content_type: "photo",
//     liked_content_id: uuidv4(),
//   }

//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/user/like?id=${id}`,
//     payload
//   )
//   return res
// }

// export const getUserApi = async (id) => {
//   const res = await axios.get(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/user`,
//     {
//       params: { id },
//     }
//   )
//   return res.data.results
// }

// export const getMyLikesApi = async () => {
//   const res = await axios.get(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/fastmatch`
//   )
//   return res.data.data.results
// }
// export const getUsersByFilterApi = async (commandType, startDate, endDate) => {
//   const res = await axios.get(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/get/users`,
//     {
//       params: { commandType, startDate, endDate },
//     }
//   )
//   return res
// }
// export const unmatch = async (matchId) => {
//   const res = await axios.delete(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/user/matches`,
//     {
//       params: { matchId },
//     }
//   )
//   return res
// }

// export const addImageUrl = async (fileName, imageUrl) => {
//   if (!fileName || !imageUrl) return

//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/addImageUrl`,
//     { fileName, imageUrl }
//   )
//   return res.data
// }
// export const readImagesFromTxt = async (sourcePath) => {
//   if (!sourcePath) return

//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/readImagesFromTxt`,
//     { sourcePath }
//   )
//   return res.data
// }
// export const fromUrlToImage = async (url, outputPath) => {
//   console.log(url, outputPath)
//   if (!outputPath || !url) return

//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/fromUrlToImage`,
//     { outputPath, url }
//   )
//   return res.data
// }
// export const getProfile = async () => {
//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/getProfile`,
//     {}
//   )
//   return res.data
// }
// export const addArrDataToTxt = async (fileName, strArr, txt) => {
//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/addArrDataToTxt`,
//     { fileName, strArr, txt }
//   )
//   return res.data
// }
// export const getRandomMessage = async () => {
//   const res = await axios.post(
//     `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/getRandomMessage`,
//     {}
//   )
//   return res.data
// }
export const startApi = async (token) => {
  const res = await axios.post(
    `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/start`,
    { token }
  )
  return res.data
}

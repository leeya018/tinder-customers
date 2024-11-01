import axios from "axios"
import { getUrl } from "./pages/api/util"
const baseUrl = getUrl()
export const startApi = async (customerXlsData) => {
  console.log("startApi", { customerXlsData })
  const res = await axios.post(`${baseUrl}/api/start`, { customerXlsData })
  return res.data
}

export const getDataFromGptApi = async (question) => {
  const res = await axios.post(
    `${baseUrl}/api/gpt`,
    { question },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}

export const getDataFromGptLearnApi = async () => {
  const res = await axios.post(
    `${baseUrl}/api/gptlaern`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}

export const getDataFromGptTrainApi = async () => {
  const res = await axios.post(
    `${baseUrl}/api/gpttrain`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}

export const getMatchesApi = async (token, payload) => {
  const res = await axios.post(
    `${baseUrl}/api/getMatches`,
    { token, payload },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}

export const getMessagesApi = async (token, matchId) => {
  const res = await axios.post(
    `${baseUrl}/api/getMessages`,
    { token, matchId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}

export const getUserApi = async (token, userId) => {
  const res = await axios.post(
    `${baseUrl}/api/getUser`,
    { token, userId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}
export const getProfileApi = async (token) => {
  const res = await axios.post(
    `${baseUrl}/api/getProfile`,
    { token },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}
export const sendMessageApi = async (token, payload) => {
  const res = await axios.post(
    `${baseUrl}/api/sendMessage`,
    { token, payload },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}
export const addInfoApi = async (newInfo) => {
  const res = await axios.post(
    `${baseUrl}/api/addinfo`,
    { newInfo },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}
export const removeMatchApi = async (matchId, token) => {
  const res = await axios.delete(
    `${baseUrl}/api/match`,
    { data: { matchId, token } },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.log(res.data)
  return res.data
}

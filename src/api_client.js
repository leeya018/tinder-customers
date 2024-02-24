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

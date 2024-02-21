import axios from "axios"
export const startApi = async (customerXlsData) => {
  try {
    console.log("startApi", { customerXlsData })
    const res = await axios.post(
      `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/start`,
      { customerXlsData }
    )
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getDataFromGptApi = async (question) => {
  try {
    const res = await axios.post(
      `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/gpt`,
      { question },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    console.log(res.data)
    return res.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const getDataFromGptLearnApi = async () => {
  try {
    const res = await axios.post(
      `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/gptlaern`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    console.log(res.data)
    return res.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const getDataFromGptTrainApi = async () => {
  try {
    const res = await axios.post(
      `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/gpttrain`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    console.log(res.data)
    return res.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

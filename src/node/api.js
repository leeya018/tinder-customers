const axios = require("axios")
require("dotenv").config()
const fs = require("fs")
// const {getToken } = require("./util");
const FormData = require("form-data")
// const { addImageUrl } = require("lib/api");
let data = new FormData()

const filePath = "messages_english.txt"

const getMessagesApi = async (matchId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/v2/matches/${matchId}/messages?locale=en&count=100`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  }

  return axios
    .request(config)
    .then((response) => {
      return response.data.data.messages
    })
    .catch((error) => {
      return error.message
    })
}
const unmatchUsersApi = async (matchId) => {
  let data = ""
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/user/matches/${matchId}?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
    data: data,
  }

  return axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.message
    })
}
const getMyLikesApi = async () => {
  console.log({ TOKEN: process.env.NEXT_PUBLIC_X_AUTH_TOKEN })
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/v2/fast-match?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  }

  return axios
    .request(config)
    .then((response) => {
      console.log(response.data.data.results)
      return response.data.data.results
    })
    .catch((error) => {
      console.log(error)
      console.log(error.message)
      return error.message
    })
}
const getMatchesApi = async (payload) => {
  const { message, is_tinder_u, amount } = payload
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/v2/matches?locale=en&count=${amount}&is_tinder_u=${is_tinder_u}&message=${message}`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  }
  return axios(config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error)
      return error.message
    })
}

const getRandomMessage = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8")
    const lines = data.split("\n").filter((line) => line.trim() !== "")
    const chosenLine = Math.floor(Math.random() * (lines.length - 1))
    console.log({ chosenLine })
    if (chosenLine < lines.length && chosenLine >= 0) {
      return lines[chosenLine]
    }

    throw new Error("Line is out of range" + chosenLine)
  } catch (err) {
    return err.message
  }
}
const sendMessageApi = async (data) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/user/matches/${data.matchId}?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
    data: JSON.stringify(data),
  }

  return axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      // console.log(error);
      return error.message
    })
}
const passUserApi = async (user, s_number, user_traveling) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/pass/${user._id}?locale=en&s_number=${s_number}&user_traveling=${user_traveling}`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  }
  return axios
    .request(config)
    .then((response) => {
      const firstImage = user.photos.map((photos) => photos.url)[0]
      console.log(firstImage)
      // addDataToTxt("../tensorFolder/pass.txt", firstImage)
      return response.data
    })
    .catch((error) => {
      console.log(error.message)
      return error.message
    })
}

const likeUserApi = async (user, data) => {
  // console.log({ token: process.env.NEXT_PUBLIC_X_AUTH_TOKEN })
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/like/${user._id}`,
    headers: {
      "app-version": "1032701",
      platform: "web",
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Chrome/100.0.4896.127",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
    data: data,
  }

  return axios
    .request(config)

    .then((response) => {
      const firstImage = user.photos.map((photos) => photos.url)[0]

      console.log(firstImage)
      // addDataToTxt("../tensorFolder/like.txt", firstImage)
      return response.data
    })
    .catch((error) => {
      //   console.log(error);
      return error.message
    })
}
const getRecsApi = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/v2/recs/core?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  }

  return axios
    .request(config)
    .then((response) => {
      const user = response.data.data.results[0].user
      console.log(Object.keys(user))
      console.log(user.photos.map((photos) => photos.url))
      console.log({})
      return response.data
    })
    .catch((error) => {
      console.log(error.message)
      //   return res.status(450).json(error);
    })
}

async function fromUrlToImage(url, pathFileName) {
  try {
    const response = await axios.get(url, {
      responseType: "stream",
    })

    const writer = fs.createWriteStream(pathFileName)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve)
      writer.on("error", reject)
    })
  } catch (error) {
    console.log(error.message)
    console.log(error.data)
  }
}
async function appendImageFromUrlToFormData(url, formData, fieldName) {
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  })
  console.log("inner func")
  // console.log(response.data);

  // Append the image stream to the FormData
  formData.append(fieldName, response.data, {
    filename: "women.jpg", // You can determine the filename as needed
    contentType: response.headers["content-type"],
  })
  // console.log(formData);
}

function addDataToTxt(fileName, str) {
  fs.appendFile(fileName, str + "\n", (err) => {
    if (err) {
      console.error("Error appending data to the file:", err)
    } else {
      console.log("Data successfully appended to the file!")
    }
  })
}
function addArrDataToTxt(fileName, strArr, txt) {
  for (const str of strArr) {
    fs.appendFileSync(fileName, str + "\n")
  }
  fs.appendFileSync(fileName, txt + "\n\n\n\n")
}

function readImagesFromTxt(url) {
  // Read the file content
  const content = fs.readFileSync(url, "utf8")

  // Split the content by newline character to get an array
  const lines = content.split("\n").filter(Boolean) // filter(Boolean) removes any empty lines

  return lines
}

const getImagesApi = async (counter) => {
  let outputPath = `C:\\Users\\user\\Downloads\\womenPics\\${counter}.png`

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/v2/recs/core?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  }

  return axios
    .request(config)
    .then(async (response) => {
      const items = response.data.data.results
      const imageUrls = items.map((item) =>
        item.user.photos.map((photos) => photos.url)
      )
      // console.log(imageUrls);
      const images = imageUrls.map((images) => images[0])
      console.log(images)
      // for (const url of images) {
      //   await fromUrlToImage(url, outputPath);
      // }
    })
    .catch((error) => {
      console.log(error.message)
      //   return res.status(450).json(error);
    })
}

// const getLotsImages = async () => {
//   let counter = 65980;
//   while (true) {
//     await getImagesApi(counter);
//     counter++;
//   }
//   // await
// };

module.exports = {
  getRecsApi,
  likeUserApi,
  passUserApi,
  getRandomMessage,
  sendMessageApi,
  getMatchesApi,
  getMyLikesApi,
  unmatchUsersApi,
  getMessagesApi,
  fromUrlToImage,
  addDataToTxt,
  readImagesFromTxt,
  getImagesApi,
  addArrDataToTxt,
  // getLotsImages,
}
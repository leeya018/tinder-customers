import axios from "axios"

export default async function handler(req, res) {
  const body = {
    user: {
      global_mode: {
        language_preferences: [
          {
            language: "en",
            is_selected: true,
          },
        ],
      },
    },
  }
  var config = {
    method: "post",
    maxBodyLength: Infinity,

    url: `https://api.gotinder.com/v2/profile?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
    data: body,
  }
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data)
    })
    .catch(function (error) {
      console.log(error)
      res.status(error.status).json(error)
    })
}

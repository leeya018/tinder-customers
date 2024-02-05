import axios from "axios";

export default function handler(req, res) {
  //   return res.status(200).json("this is the user id ");
  const { id } = req.query;
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/user/${id}?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(450).json(error);
    });
}

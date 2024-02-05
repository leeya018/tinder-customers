import axios from "axios";
import { addUesr } from "lib/db";

export default function handler(req, res) {
  //   return res.status(200).json("this is the user id ");
  const { id } = req.query;

  let data = JSON.stringify(req.body);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/like/${id}`,
    headers: {
      "app-version": "1032701",
      platform: "web",
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Chrome/100.0.4896.127",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
    data: data,
  };

  axios
    .request(config)
    .then(async (response) => {
      await addUesr({
        userId: id,
        commandType: "like",
      });
      // console.log(JSON.stringify(response.data));
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      //   console.log(error);
      return res.status(450).json(error.message);
    });
}

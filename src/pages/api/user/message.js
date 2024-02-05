// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import { addUesr } from "lib/db";

export default function handler(req, res) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/user/matches/${req.body.matchId}?locale=en`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
    data: JSON.stringify(req.body),
  };

  axios
    .request(config)
    .then(async (response) => {
      // console.log(JSON.stringify(response.data));
      await addUesr({
        userId: req.body.otherId,
        commandType: "message",
      });
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      // console.log(error);
      return res.status(450).json(error.message);
    });
}

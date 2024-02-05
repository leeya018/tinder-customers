import axios from "axios";
import { addUesr } from "lib/db";

export default function handler(req, res) {
  const { id, s_number, user_traveling, fast_match } = req.query;
  let fast_match_url = "";
  let newId = id;
  console.log({ fast_match });
  if (fast_match == 1) {
    // newId = `?id=${id}`;
    fast_match_url = "&fast_match=1";
  }
  const urlPrint = `https://api.gotinder.com/pass/${newId}?locale=en&s_number=${s_number}${fast_match_url}&user_traveling=${user_traveling}`;
  console.log("handler pass");
  console.log(urlPrint);
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.gotinder.com/pass/${newId}?locale=en&s_number=${s_number}${fast_match_url}&user_traveling=${user_traveling}`,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN,
    },
  };
  axios
    .request(config)
    .then(async (response) => {
      await addUesr({
        userId: id,
        commandType: "pass",
      });
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(450).json(error.message);
    });
}

// http://localhost:3000/api/user/pass?id=64651c7356438701000f141e&s_number=4576168990297336&user_traveling=1&fast_match=1

// https://api.gotinder.com/pass/6461f04d54a5620100ae2fd8?locale=en&fast_match=1&s_number=3920310302949838&rec_traveling=1&user_traveling=1
// https://api.gotinder.com/pass/?id=64651c7356438701000f141e?locale=en&s_number=4027512688037112&fast_match=1&user_traveling=1

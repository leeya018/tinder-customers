import { main } from "../../node"
import { sleep } from "../../node/util"

export default async function handler(req, res) {
  try {
    // main()
    const { token } = req.body
    console.log("start the main function")
    // main()
    for (let i = 0; i < 100; i++) {
      console.log(token + " " + i)
      await sleep(1000)
    }
    return res.status(200).json("data")
  } catch (error) {
    return res.status(450).json(error)
  }
}

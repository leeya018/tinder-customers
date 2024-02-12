import { main, test } from "../../node"

export default async function handler(req, res) {
  try {
    // main()
    const { token, lookFor } = req.body
    console.log("start the main function")
    const name = await main(token, lookFor)
    // const name = await test(token)

    // console.log("servr" + name)
    // for (let i = 0; i < 100; i++) {
    //   console.log(token + " " + i)
    //   await sleep(1000)
    // }
    return res.status(200).send(name)
  } catch (error) {
    return res.status(450).json(error)
  }
}

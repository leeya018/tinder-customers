import { main } from "../../node"

export default function handler(req, res) {
  try {
    // main()
    console.log("start the main function")
    main()
    // const data = function1()
    return res.status(200).json("data")
  } catch (error) {
    return res.status(450).json(error)
  }
}

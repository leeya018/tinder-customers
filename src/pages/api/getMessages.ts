import nc from "next-connect"
import { corsMiddleware } from "./validate"
import type { NextApiRequest, NextApiResponse } from "next"
import { getMessagesApi } from "@/node/api"

const handler = nc({ attachParams: true })
handler.use(corsMiddleware)

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, matchId } = req.body
  const result = await getMessagesApi(token, matchId)
  res.status(200).json(result)
})
export default handler

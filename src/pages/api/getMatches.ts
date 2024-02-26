import nc from "next-connect"
import { corsMiddleware } from "./validate"
import type { NextApiRequest, NextApiResponse } from "next"
import { getMatchesApi } from "@/node/api"

const handler = nc({ attachParams: true })
handler.use(corsMiddleware)

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, payload } = req.body
  const result = await getMatchesApi(token, payload)
  res.status(200).json(result.data.matches)
})
export default handler

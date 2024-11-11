import nc from "next-connect";
import { corsMiddleware } from "./validate";
import type { NextApiRequest, NextApiResponse } from "next";
import { getMessagesApi, getProfileApi, getUserApi } from "@/node/api";

const handler = nc({ attachParams: true });
handler.use(corsMiddleware);

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.body;
  const result = await getProfileApi(token);
  res.status(200).json(result);
});
export default handler;

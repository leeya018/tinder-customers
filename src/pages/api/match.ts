import nc from "next-connect";
import { corsMiddleware } from "./validate";
import type { NextApiRequest, NextApiResponse } from "next";
import { getMatchesApi, unmatchUsersApi } from "@/node/api";

const handler = nc({ attachParams: true });
handler.use(corsMiddleware);

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log({ body: req.body });
  const { matchId, token } = req.body;
  const result = await unmatchUsersApi(token, matchId);
  res.status(200).json(result.data);
});
export default handler;

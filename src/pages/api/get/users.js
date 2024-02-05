import { getUsersFilter } from "lib/db";

export default async function handler(req, res) {
  //   return res.status(200).json("trtsr");
  const { startDate, endDate, commandType } = req.query;
  try {
    const result = await getUsersFilter(commandType, startDate, endDate);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(451).json(error.message);
  }
}

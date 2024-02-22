import { sleep, timeBetween } from "@/pages/api/util"
import { getRecsApi } from "./api"

export const getRecs = async (token: string) => {
  let res = null

  do {
    res = await getRecsApi(token)
    await sleep(timeBetween.GET_RECS)
  } while (!res || !res?.data || res?.data?.results?.length < 0)
  return res.data.results
}

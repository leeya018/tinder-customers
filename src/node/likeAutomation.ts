import { Customer } from "@/api/firestore/customer/interfaces"
import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"
import { sleep, swipesLim, timeBetween, swipesFolder } from "@/pages/api/util"
import { isGoodFit } from "./isGoodFit"
import path from "path"
import DetailedError from "./DetailedError"
import { getRecs } from "./getRecs"
import { handleLike } from "./handleLike"
import { handlePass } from "./handlePass"

let likes = 0
let passes = 0

const recIterationLike = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  const { token, lookFor, isLookGood } = customerXlsData

  const recs = await getRecs(token)

  const folderName = customer.name
  const pathUrl = path.join(swipesFolder, folderName)

  for (const rec of recs) {
    const isFit = await isGoodFit(rec.user, customerXlsData)
    const firstImage = rec.user.photos?.[0]?.url

    if (isFit) {
      console.log("HOT")
      likes++
      await handleLike(token, rec, pathUrl, customer, firstImage)
    } else {
      passes++
      await handlePass(token, rec, pathUrl, customer, firstImage)
    }

    await sleep(timeBetween.GET_RECS)
  }

  console.log({ likes, passes })
}

export const likeAutomation = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  console.log("==================LIKE_AUTOMATION========================")
  try {
    while (passes + likes < swipesLim) {
      await recIterationLike(customer, customerXlsData)
      await sleep(timeBetween.LIKE_LOOP)
    }
    console.log({ likes, passes })
  } catch (error: any) {
    throw new DetailedError(error.message, customer.name)
  }
}

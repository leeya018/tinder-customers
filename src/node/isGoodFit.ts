import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"
import { predict } from "./modelCreate"
import { convertPrediction, likeRatioBarrier } from "@/pages/api/util"
import { getIsLookForFit } from "./getIsLookForFit"

export const isGoodFit = async (
  user: any,
  customerXlsData: CustomerXlsData
) => {
  const { lookFor, isLookGood } = customerXlsData
  const firstPhotoUrl = user.photos[0]?.url

  if (!firstPhotoUrl) {
    console.error("User has no photos.")
    return false
  }

  let likePred = 1

  if (isLookGood && firstPhotoUrl) {
    const prediction = await predict(firstPhotoUrl)
    const pred = convertPrediction(prediction)
    console.log({ pred })
    likePred = pred.like
  }
  const isFitPref = getIsLookForFit(lookFor, user)

  return isFitPref && likePred > likeRatioBarrier
}

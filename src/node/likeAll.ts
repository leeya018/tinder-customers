import { Customer } from "@/api/firestore/customer/interfaces"
import { CustomerXlsData } from "@/api/firestore/customerXlsData/interface"
import { getMyLikesApi, likeUserApi } from "./api"
import { isGoodFit } from "./isGoodFit"
import { payloadLike, sleep, timeBetween } from "@/pages/api/util"
import { Like } from "@/api/firestore/like/interfaces"
import { Timestamp } from "firebase/firestore"
import { addLikeFirestore } from "@/api/firestore"
import DetailedError from "./DetailedError"
import moment from "moment"
import { addLikeServer } from "@/api/firestore/like/addLikeServer"

export const likeAll = async (
  customer: Customer,
  customerXlsData: CustomerXlsData
) => {
  try {
    const { token, lookFor } = customerXlsData

    const recs = await getMyLikesApi(token)
    console.log("Total recommendations:", recs.length)

    for (let i = 0; i < recs.length; i++) {
      const rec = recs[i]
      console.log(`Processing recommendation ${i + 1}...`)
      const isFit = await isGoodFit(rec.user, customerXlsData)
      console.log(
        `User: ${rec.user.name}, LookFor: ${lookFor}, IsFit: ${isFit}`
      )

      if (isFit) {
        await likeUserApi(token, rec.user, payloadLike(rec.s_number))
        console.log(`Liked user: ${rec.user._id}`)
      } else {
        console.log("Passed user.")
        // Uncomment the next line if you want to pass users who are not a good fit
        // await passUserWithMatchApi(token, rec.user, rec.s_number, 1);
      }

      const firstImage = rec.user.photos[0]?.url || "No image"
      const newLike: Like = {
        userId: customer.id,
        likeUrl: firstImage,
        createdDate: Timestamp.now(),
      }
      await addLikeServer(newLike, customer)
      await sleep(timeBetween.ENGAGEMENT)
      const dateTimeFormat = "DD-MM-YYYY HH:mm:ss"
      const dateStr = moment().format(dateTimeFormat)
      console.log("====ENGAGEMENT====" + dateStr)
    }
  } catch (error: any) {
    throw new DetailedError(error.message, customer.name)
  }
}

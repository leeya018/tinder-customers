import { Customer } from "@/api/firestore/customer/interfaces"
import { likeUserApi } from "./api"
import { addDataToTxt, payloadLike } from "@/pages/api/util"
import { Like } from "@/api/firestore/like/interfaces"
import { Timestamp } from "firebase/firestore"
import { addLikeFirestore } from "@/api/firestore"

export const handleLike = async (
  token: string,
  rec: any,
  pathUrl: string,
  customer: Customer,
  firstImage: string
) => {
  await likeUserApi(token, rec.user, payloadLike(rec.s_number))
  if (firstImage) {
    addDataToTxt(pathUrl, "like.txt", firstImage)
  }
  const newLike: Like = {
    userId: customer.id,
    likeUrl: firstImage,
    createdDate: Timestamp.now(),
  }
  await addLikeFirestore(newLike, customer)
  console.log("LIKE USER:", rec.user._id)
}

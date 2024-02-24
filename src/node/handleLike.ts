import { Customer } from "@/api/firestore/customer/interfaces"
import { likeUserApi } from "./api"
import { addDataToTxt, infoTypes, payloadLike } from "@/pages/api/util"
import { Like } from "@/api/firestore/like/interfaces"
import { Timestamp } from "firebase/firestore"
import { addInfoFirestore, addLikeFirestore } from "@/api/firestore"
import { addInfo } from "@/api/firestore/info/addInfo"
import { info } from "@/api/firestore/info/interfaces"

export const handleLike = async (
  token: string,
  rec: any,
  pathUrl: string,
  customer: Customer,
  firstImage: string
) => {
  await likeUserApi(token, rec.user, payloadLike(rec.s_number))
  if (firstImage) {
    const info: info = {
      customerName: customer.name,
      data: firstImage,
      type: infoTypes.LIKE,
    }
    console.log("adding data to info LIKE")

    addInfoFirestore(info)
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

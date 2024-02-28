import { addDataToTxt, infoTypes } from "@/pages/api/util"
import { passUserApi } from "./api"
import { info } from "@/api/firestore/info/interfaces"
import { addInfoFirestore } from "@/api/firestore"
import { Customer } from "@/api/firestore/customer/interfaces"
import { addInfoServer } from "@/api/firestore/info/addInfoServer"

export const handlePass = async (
  token: string,
  rec: any,
  pathUrl: string,
  customer: Customer,
  firstImage: string
) => {
  await passUserApi(token, rec.user, rec.s_number, 1)
  if (firstImage) {
    const info: info = {
      customerName: customer.name,
      data: firstImage,
      type: infoTypes.PASS,
    }

    console.log("adding data to info PASS")
    addInfoServer(info)
    // addDataToTxt(pathUrl, "pass.txt", firstImage)
  }
  console.log("PASS USER:", rec.user._id)
}

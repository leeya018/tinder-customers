import { addDataToTxt } from "@/pages/api/util"
import { passUserApi } from "./api"

export const handlePass = async (
  token: string,
  rec: any,
  pathUrl: string,
  firstImage: string
) => {
  await passUserApi(token, rec.user, rec.s_number, 1)
  if (firstImage) {
    addDataToTxt(pathUrl, "pass.txt", firstImage)
  }
  console.log("PASS USER:", rec.user._id)
}

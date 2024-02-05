const fs = require("fs")

export default function handler(req, res) {
  try {
    const { fileName, strArr, txt } = req.body

    for (const str of strArr) {
      fs.appendFileSync(fileName, str + "\n")
    }
    fs.appendFileSync(fileName, txt + "\n\n\n\n")

    return res.status(200).json("success addArrDataToTxt")
  } catch (error) {
    return res.status(450).json(error)
  }
}

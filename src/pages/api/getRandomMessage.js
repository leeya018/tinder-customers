const fs = require("fs")

export default function handler(req, res) {
  try {
    const filePath = "messages_english.txt"

    const data = fs.readFileSync(filePath, "utf8")
    const lines = data.split("\n").filter((line) => line.trim() !== "")
    const chosenLine = Math.floor(Math.random() * (lines.length - 1))
    console.log({ chosenLine })
    if (chosenLine < lines.length && chosenLine >= 0) {
      // return lines[chosenLine]
      return res.status(200).send(lines[chosenLine])
    }
    throw new Error("Line is out of range" + chosenLine)
  } catch (error) {
    return res.status(450).json(error)
  }
}

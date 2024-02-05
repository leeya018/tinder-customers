const fs = require("fs");

// Specify the file path
const filePath = "starters_hebrew.txt";

export default function handler(req, res) {
  try {
    // if line number is differen that -1 so make it random
    let { lineNumber } = req.query;

    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.split("\n").filter((line) => line.trim() !== "");
    const chosenLine =
      Number(lineNumber) !== -1
        ? lineNumber
        : Math.floor(Math.random() * lines.length);
    console.log({ chosenLine });
    if (chosenLine < lines.length && chosenLine >= 0) {
      console.log("line content:", lines[chosenLine]);
      return res.status(200).json(lines[chosenLine]);
    }

    throw new Error("Line is out of range" + chosenLine);
  } catch (err) {
    console.error("Error reading the file:", err);
    return res.status(450).json(err.message);
  }
}

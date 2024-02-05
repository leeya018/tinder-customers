const fs = require("fs");

const path = "tensorFolder/all.txt";
export default async function handler(req, res) {
  console.log("read from txt");
  // const { sourcePath } = req.body;

  const content = fs.readFileSync(path, "utf8");

  // Split the content by newline character to get an array
  const lines = content.split("\n").filter(Boolean); // filter(Boolean) removes any empty lines
  console.log(lines.slice(0, 19));
  return res.status(200).json(lines);
}

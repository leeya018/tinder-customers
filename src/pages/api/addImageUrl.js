const fs = require("fs");

export default function handler(req, res) {
  const { fileName, imageUrl } = req.body;

  fs.appendFile(fileName, imageUrl + "\n", (err) => {
    if (err) {
      console.error("Error appending data to the file:", err);
    } else {
      console.log("Data successfully appended to the file!");
      return res.status(200).json({ message: "success" });
    }
  });
}

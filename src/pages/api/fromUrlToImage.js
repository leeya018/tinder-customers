import axios from "axios";

const fs = require("fs");

export default async function handler(req, res) {
  const { url, outputPath } = req.body;

  try {
    const response = await axios.get(url, {
      responseType: "stream",
    });

    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // If everything goes well, send a success response.
    res.status(200).json({ message: "File successfully saved!" });
  } catch (error) {
    console.error(error.message);

    // Return a 500 Internal Server Error response if something goes wrong.
    res
      .status(500)
      .json({ message: "An error occurred", details: error.message });
  }
}

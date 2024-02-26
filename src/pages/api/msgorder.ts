import { exec } from "child_process"
//  not workign
export default function handler(req, res) {
  if (req.method === "POST") {
    const script = `
      @echo off
      cd C:\\Users\\user\\Desktop\\code\\lee\\tinder-axios
      start cmd /c npm run dev
      timeout /t 5
      start "" http://localhost:4000/msgorder
    `

    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return res.status(500).json({ message: "Script execution failed" })
      }
      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)
      res.status(200).json({ message: "Script executed successfully" })
    })
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

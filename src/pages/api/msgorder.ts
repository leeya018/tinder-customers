import { exec } from "child_process"
//  not workign
import { spawn } from "child_process"
import nc from "next-connect"
import { corsMiddleware } from "./validate"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = nc({ attachParams: true })
handler.use(corsMiddleware)

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const cmd = spawn("cmd.exe", [
      "/c",
      "cd C:\\Users\\user\\Desktop\\code\\lee\\tinder-axios && npm run dev",
    ])

    const script = `
      @echo off
      timeout /t 5
      start "" http://localhost:4000/msgorder
    `

    cmd.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`)
    })

    cmd.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`)
    })

    cmd.on("close", (code) => {
      console.log(`child process exited with code ${code}`)
      if (code === 0) {
        res.status(200).json({ message: "Script executed successfully" })
      } else {
        res.status(500).json({ message: "Script execution failed" })
      }
    })
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
})
export default handler

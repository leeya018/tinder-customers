import React, { ChangeEvent, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import * as XLSX from "xlsx"

type LoadXlsProps = {
  callback: () => void
}
const LoadXls = observer<LoadXlsProps>(({ callback }) => {
  const [data, setData] = useState<any>([])

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !e.target.files[0]) throw new Error("File in Null")

      const file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (event) => {
        const binaryString = event.target.result
        const workbook = XLSX.read(binaryString, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        setData(jsonData)
        console.log({ jsonData })
        callback(jsonData)
      }
      reader.readAsBinaryString(file)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {/* <table>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {row.map((cell: string, cellIndex: number) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  )
})

export default LoadXls

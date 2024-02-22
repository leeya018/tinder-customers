import { getFullStrTime } from "@/pages/api/util"
import moment from "moment"

class DetailedError extends Error {
  customerName: string
  date: string

  constructor(message: string, customerName: string) {
    super(message) // Call the parent constructor with the message
    this.name = this.constructor.name // Set the name of the error to the name of the class
    this.customerName = customerName
    this.date = getFullStrTime()
  }
}

export default DetailedError
// class DetailedError extends Error {
//   customerName: string
//   functionName: string
//   lineNumber: string

//   constructor(
//     message: string,
//     customerName: string,
//     functionName: string,
//     lineNumber: string
//   ) {
//     super(message) // Call the parent constructor with the message
//     this.name = this.constructor.name // Set the name of the error to the name of the class
//     this.customerName = customerName
//     this.functionName = functionName
//     this.lineNumber = lineNumber
//   }
// }

// export default DetailedError

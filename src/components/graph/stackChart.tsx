import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import moment from "moment"
import { observer } from "mobx-react-lite"
import { Timestamp } from "firebase/firestore"
import { areSameDay, fromTimestampToStr } from "@/util"

// import faker from "faker"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
}

const getSmallestDate = (date1: Timestamp, date2: Timestamp) => {
  let smallestDate = null
  if (date1.seconds <= date2.seconds) {
    smallestDate = date1.toDate()
  } else {
    smallestDate = date2.toDate()
  }
  smallestDate.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(smallestDate)
}

const getBiggestDate = (date1: Timestamp, date2: Timestamp) => {
  let biggestDate = null
  if (date1.seconds >= date2.seconds) {
    biggestDate = date1.toDate()
  } else {
    biggestDate = date2.toDate()
  }
  biggestDate.setHours(23, 59, 59, 999)
  return Timestamp.fromDate(biggestDate)
}

// const createDatesArr = (
//   smallestDate: moment.Moment,
//   biggestDate: moment.Moment
// ) => {
//   let currentDate = smallestDate.clone() // Clone the smallestDate to avoid mutating the original date
//   let datesArray = []

//   // Loop until the currentDate is the same as or after the biggestDate
//   while (currentDate.isSameOrBefore(biggestDate)) {
//     datesArray.push(currentDate.clone()) // Add the current date to the array
//     console.log({ currentDate })
//     currentDate.add(1, "days") // Move to the next day
//   }
//   // datesArray.push(biggestDate)
//   console.log({ smallestDate, biggestDate })
//   // console.log("valid", smallestDate.isValid(), biggestDate.isValid())
//   console.log({ datesArray })
//   return datesArray
// }

const createDatesArr = (
  smallestDate: Timestamp,
  biggestDate: Timestamp
): Timestamp[] => {
  // Convert Firestore Timestamps to JavaScript Date objects
  let currentDate = smallestDate.toDate()

  const endDate = biggestDate.toDate()

  const datesArray: Timestamp[] = []

  // Loop until the current date exceeds the end date
  while (currentDate <= endDate) {
    // Add the current date to the array as a Firestore Timestamp
    datesArray.push(Timestamp.fromDate(new Date(currentDate)))

    // Increment the current date by one day
    currentDate.setDate(currentDate.getDate() + 1)
  }
  const smallestDateStr = fromTimestampToStr(smallestDate)
  const biggestDateStr = fromTimestampToStr(biggestDate)
  console.log({ smallestDateStr, biggestDateStr })
  const dateArrStr = datesArray.map((dateItem) => fromTimestampToStr(dateItem))
  console.log({ dateArrStr })

  return datesArray
}

type dataItem = {
  amount: number
  createdDate: Timestamp
}
const createFullArr = (dates: Timestamp[], dataArr: dataItem[]) => {
  const itemsMap = new Map(
    dataArr.map((data) => [fromTimestampToStr(data.createdDate), data.amount])
  )

  // Create the full array of likes data including all dates
  console.log(dates.map((d) => fromTimestampToStr(d)))
  const fullArray = dates.map((date) => {
    const dateStr = fromTimestampToStr(date)
    const amount = itemsMap.get(dateStr) || 0 // Get the like amount if exists, else use 0
    return { createdDate: date, amount }
  })

  return fullArray
}
export type DataItemsProps = {
  likesData: any[]
  messagesData: any[]
}

const Order = {
  asc: "asc",
  desc: "desc",
}
type Item = {
  createdDate: Timestamp
  amount: number
}

const sortItemsByDates = (items: Item[], order: string) => {
  const sortedItems = items.sort((item1: Item, item2: Item) => {
    if (order == Order.asc) {
      return item1.createdDate.seconds - item2.createdDate.seconds
    }
    return item2.createdDate.seconds - item1.createdDate.seconds
  })
  return sortedItems
}
const StackChart = observer<DataItemsProps>(({ dataItems }) => {
  const { likesData, messagesData } = dataItems
  console.log({ likesData, messagesData })

  // console.log(createDatesArr(moment().subtract(3, "days"), Timestamp.now()))
  // console.log(
  //   moment().subtract(3, "days").format("YYYY-MM-DD"),
  //   moment().format("YYYY-MM-DD")
  // )

  const likesDataSortByDate = sortItemsByDates(likesData, Order.asc)
  const messagesDataSortByDate = sortItemsByDates(messagesData, Order.asc)

  console.log({ likesDataSortByDate, messagesDataSortByDate })

  const smallestDate: Timestamp = getSmallestDate(
    likesDataSortByDate[0]?.createdDate,
    messagesDataSortByDate[0]?.createdDate
  )
  const likesLen = likesDataSortByDate.length
  const messagesLen = messagesDataSortByDate.length

  const biggestDate: Timestamp = getBiggestDate(
    likesDataSortByDate[likesLen - 1]?.createdDate,
    messagesDataSortByDate[messagesLen - 1]?.createdDate
  )

  console.log({ smallestDate, biggestDate })
  console.log(fromTimestampToStr(smallestDate), fromTimestampToStr(biggestDate))

  const labels = createDatesArr(smallestDate, biggestDate)
  // const labels = []
  console.log(labels)

  // const itemsLikes = []
  // const itemsMessages = []
  const itemsLikes = createFullArr(labels, likesDataSortByDate)
  const itemsMessages = createFullArr(labels, messagesDataSortByDate)
  console.log(itemsLikes, itemsMessages)

  const data = {
    labels: labels.map((d) => fromTimestampToStr(d)),
    datasets: [
      {
        label: "Likes",
        data: itemsLikes.map((l) => l.amount),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Messages",
        data: itemsMessages.map((l) => l.amount),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  // return <div>etsnesrnt</div>
  return <Line options={options} data={data} />
})

export default StackChart

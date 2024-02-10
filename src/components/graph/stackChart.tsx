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

const getSmallestDate = (date1: moment.Moment, date2: moment.Moment) => {
  if (date1.isBefore(date2)) {
    // If date1 is earlier, return date1
    return date1
  } else {
    // Otherwise, return date2
    return date2
  }
}
const getBiggestDate = (date1: moment.Moment, date2: moment.Moment) => {
  if (date1.isAfter(date2)) {
    // If date1 is earlier, return date1
    return date1
  } else {
    // Otherwise, return date2
    return date2
  }
}

const createDatesArr = (
  smallestDate: moment.Moment,
  biggestDate: moment.Moment
) => {
  let currentDate = smallestDate.clone() // Clone the smallestDate to avoid mutating the original date
  let datesArray = []

  // Loop until the currentDate is the same as or after the biggestDate
  while (currentDate.isSameOrBefore(biggestDate)) {
    datesArray.push(currentDate.clone()) // Add the current date to the array
    currentDate.add(1, "days") // Move to the next day
  }

  return datesArray
}

type dataItem = {
  amount: number
  createdDate: moment.Moment
}
const createFullArr = (dates: moment.Moment[], dataArr: dataItem[]) => {
  const itemsMap = new Map(
    dataArr.map((data) => [data.createdDate.format("YYYY-MM-DD"), data.amount])
  )

  // Create the full array of likes data including all dates
  console.log(dates.map((d) => d.format("YYYY-MM-DD")))
  const fullArray = dates.map((date) => {
    const dateStr = date.format("YYYY-MM-DD")
    const amount = itemsMap.get(dateStr) || 0 // Get the like amount if exists, else use 0
    return { createdDate: date, amount }
  })

  return fullArray
}
export type DataItemsProps = {
  likesData: any[]
  messagesData: any[]
}

const StackChart = observer<DataItemsProps>(({ dataItems }) => {
  const { likesData, messagesData } = dataItems
  console.log({ likesData, messagesData })
  const smallestDate = getSmallestDate(
    likesData[0].createdDate,
    messagesData[0].createdDate
  )
  const biggestDate = getBiggestDate(
    likesData[0].createdDate,
    messagesData[0].createdDate
  )
  console.log({ smallestDate, biggestDate })
  console.log(
    smallestDate.format("YYYY-MM-DD"),
    biggestDate.format("YYYY-MM-DD")
  )

  const labels = createDatesArr(smallestDate, biggestDate)
  console.log(labels)

  const itemsLikes = createFullArr(labels, likesData)
  const itemsMessages = createFullArr(labels, messagesData)
  console.log(itemsLikes, itemsMessages)

  const data = {
    labels: labels.map((d) => d.format("YYYY-MM-DD")),
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

  return <Line options={options} data={data} />
})

export default StackChart

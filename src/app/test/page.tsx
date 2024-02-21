"use client"
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { getDataFromGptLearnApi, getDataFromGptTrainApi } from "@/api_client"

const TestPage = observer(() => {
  useEffect(() => {
    getDataFromGptLearnApi()
      // getDataFromGptTrainApi()
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return <div>tes page</div>
})

export default TestPage

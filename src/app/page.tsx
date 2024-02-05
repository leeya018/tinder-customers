"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { NavNames } from "@/util"
import { observer } from "mobx-react-lite"

const RootPage = observer(() => {
  const router = useRouter()
  // router.push(NavNames.home)
  return <div className="h-[100vh]">this is the firs page </div>
})

export default RootPage

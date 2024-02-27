"use client"
import React, { useEffect, useRef, useState } from "react"
import Navbar from "@/components/navbar"
import ProtectedRout from "@/components/protectedRout"

import { observer } from "mobx-react-lite"
import {
  getMatchesApi,
  getMessagesApi,
  getUserApi,
  sendMessageApi,
} from "@/api_client"
import { NavNames, sleep, timeBetween } from "@/pages/api/util"
import { data } from "./data"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FaHome } from "react-icons/fa"

const token = "21317bf0-e0ee-4c66-8bff-9fd31509a424"
const mPayload = {
  message: 1, //if there are messages in the pull
  amount: 40, // how many matches to return
  is_tinder_u: true,
  pageToken: null,
}

const matchId = "5980deb74a75f5b45fb118ee63ecad4f083ea501001fc6db"

const myId = "5980deb74a75f5b45fb118ee"
// const item = data[0]
const MsgOrderPage = observer(() => {
  const [messagesArr, setMessagesArr] = useState<any>([])
  const [txtMsg, setTxtMsg] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [mchPayload, setMchPayload] = useState(mPayload)
  const [nextPageToken, setNextPageToken] = useState(null)
  const scrollRef = useRef<any>(null)
  const inputRef = useRef<any>(null)

  const router = useRouter()

  console.log({ messagesArr })

  useEffect(() => {
    if (inputRef.current && messagesArr.length !== 0) {
      console.log({ current: inputRef.current })
      inputRef?.current?.focus()
    }
  }, [inputRef.current, messagesArr])

  // useEffect(() => {
  //   getMyMessages()
  // }, [])
  useEffect(() => {
    if (messagesArr.length === 0) {
      getMyMessages()
    }
  }, [messagesArr])

  const getMatches = async () => {
    return await getMatchesApi(token, mchPayload)
  }
  // const getUser = async () => {
  //   const user = await getUserApi(token, "6240c3faa7299401007624a1")
  //   console.log({ user })
  //   return user
  // }

  const createCustomData = (match: any, user: any, messages: any) => {
    const photos = match.person.photos.map((item: any) => item.url)
    const customMessages = messages.map((message: any) => {
      return {
        from: message.from === myId ? "YOU" : match.person.name,
        to: message.to === myId ? "YOU" : match.person.name,
        message: message.message,
        matchId: message.matchId,
      }
    })
    const data = {
      id: user._id, // check
      name: match.person.name,
      photos,
      bio: user.bio,
      messages: customMessages,
      matchId: match._id,
    }
    return data
  }

  const filterMatches = async (matches: any) => {
    let filteredMatches = []
    for (const match of matches) {
      if (!match.id) throw new Error("match id not specified")
      const messages = await getMessagesApi(token, match.id)
      const userId = match.person.id
      const firstMessage = messages[0]

      if (firstMessage.from !== myId) {
        const user = await getUserApi(token, userId)
        const newCustomData = createCustomData(match, user, messages)
        filteredMatches.push(newCustomData)
        setMessagesArr(filteredMatches)
      }
      await sleep(timeBetween.CUSTOM)
    }
    return filteredMatches
  }

  const sendMessage = async () => {
    const firstItem = messagesArr[0]
    let updateItem = { ...firstItem }
    const newMessage = {
      from: "YOU",
      to: updateItem.name,
      message: txtMsg,
    }
    updateItem.messages.unshift(newMessage)
    setMessagesArr((prev: any) => [updateItem, ...prev.slice(1)])
    // send the message here

    const payload = {
      userId: myId,
      otherId: firstItem.id,
      matchId: firstItem.matchId,
      sessionId: null,
      message: txtMsg,
    }
    console.log(payload)
    sendMessageApi(token, payload).catch((err) => {
      console.log(err)
    })
    setTxtMsg("")
  }

  const handleKeyDown = (e: any) => {
    console.log(e.code)
    if (e.code === "Enter") {
      sendMessage()
    } else if (e.code === "NumpadEnter") {
      setMessagesArr((prev: any) => [...prev.slice(1)])
    }
  }

  // match.person.photos.map(item =>item.url)
  // match.person.name
  const getMyMessages = async () => {
    setIsLoading(true)
    console.log("what is up")
    const { matches, next_page_token } = await getMatches()
    setMchPayload((prev) => ({
      ...prev,
      pageToken: nextPageToken,
    }))
    console.log({ next_page_token, matches })
    const results = await filterMatches(matches)
    console.log({ results })
    setIsLoading(false)
    // setMessagesArr(results)
  }
  if (messagesArr.length === 0 && isLoading) {
    return (
      <div className="flex justify-center items-center bg-pink-400 w-full h-screen flex-col">
        <div className="text-5xl font-semibold  text-white">
          We are loading ...
        </div>
      </div>
    )
  }
  if (messagesArr.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center bg-pink-400 w-full h-screen flex-col">
        <div className="text-5xl font-semibold  text-white">
          done for today{" "}
        </div>
        <div
          className="flex items-center gap-2 mt-5 cursor-pointer hover:scale-105 duration-300"
          onClick={() => router.push(NavNames.home)}
        >
          back to <FaHome size={25} />
        </div>
      </div>
    )
  }
  return (
    <ProtectedRout>
      <Navbar />
      <div className=" container max-h-screen p-10 mt-20 relative ">
        {/* images */}
        <ul className="flex justify-between flex-wrap gap-2">
          {[...messagesArr[0].photos].map((url, key) => (
            <li key={key}>
              <Image
                alt="girl image"
                width={200}
                height={200}
                className="object-fit"
                src={url}
              />
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <span className="font-semibold">name: </span>
          {messagesArr[0].name}
        </div>
        <div className="mt-10">{messagesArr[0].bio}</div>
        {/* message send section */}
        <div className="mt-5 flex items-center h-14 gap-2  ">
          <input
            value={txtMsg}
            onChange={(e) => setTxtMsg(e.target.value)}
            ref={inputRef}
            type="text"
            className="border-2 rounded-lg h-full flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="text-white bg-blue-500 hover:text-blue-500 hover:bg-white rounded-lg px-5 py-3"
          >
            send message
          </button>
        </div>
        {/* messages */}
        <ul
          className="flex flex-col  gap-3 border-2 max-h-96 overflow-scroll mt-10 "
          ref={scrollRef}
        >
          {messagesArr[0].messages.map((message: any, key: number) => (
            <li key={key}>
              <div className="flex gap-3">
                <div className="font-semibold text-lg">{message.from} :</div>
                <div>{message.message}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* <div>msgorder</div>
        <button onClick={getMyMessages}>get user</button> */}
        {/* <button onClick={getMatches}>get matches</button> */}
      </div>
    </ProtectedRout>
  )
})
export default MsgOrderPage

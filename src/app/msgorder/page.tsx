"use client"
import React, { useEffect, useRef, useState } from "react"
import Navbar from "@/components/navbar"
import ProtectedRout from "@/components/protectedRout"

import { observer } from "mobx-react-lite"
import { getMatchesApi, getMessagesApi, getUserApi } from "@/api_client"
import { sleep, timeBetween } from "@/pages/api/util"
import { data } from "./data"
import Image from "next/image"

const token = "21317bf0-e0ee-4c66-8bff-9fd31509a424"
const payload = {
  message: 1, //if there are messages in the pull
  amount: 10, // how many matches to return
  is_tinder_u: true,
}

const matchId = "5980deb74a75f5b45fb118ee63ecad4f083ea501001fc6db"

const myId = "5980deb74a75f5b45fb118ee"
const item = data[0]
const MsgOrderPage = observer(() => {
  const [messagesArr, setMessagesArr] = useState<any>([...data])
  const scrollRef = useRef<any>(null)
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef?.current?.focus()
    }
  }, [inputRef.current])

  const getMatches = async () => {
    return await getMatchesApi(token, payload)
  }
  const getUser = async () => {
    const user = await getUserApi(token, "6240c3faa7299401007624a1")
    console.log({ user })
    return user
  }

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
      name: match.person.name,
      photos,
      bio: user.bio,
      messages: customMessages,
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
      }
      await sleep(timeBetween.CUSTOM)
    }
    return filteredMatches
  }

  // match.person.photos.map(item =>item.url)
  // match.person.name
  const main = async () => {
    const matches = await getMatches()
    const results = await filterMatches(matches)
    console.log({ results })
    setMessagesArr(results)
  }
  return (
    <ProtectedRout>
      <Navbar />
      <div className=" container max-h-screen p-10 mt-20 relative ">
        {/* images */}
        <ul className="flex justify-between flex-wrap gap-2">
          {[...item.photos].map((url, key) => (
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
          {item.name}
        </div>
        <div className="mt-10">{item.bio}</div>
        {/* message send section */}
        <div className="mt-5 flex items-center h-14 gap-2  ">
          <input
            ref={inputRef}
            type="text"
            className="border-2 rounded-lg h-full flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => {}}
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
          {item.messages.map((message, key) => (
            <li key={key}>
              <div className="flex gap-3">
                <div className="font-semibold text-lg">{message.from} :</div>
                <div>{message.message}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* <div>msgorder</div>
        <button onClick={main}>get user</button> */}
        {/* <button onClick={getMatches}>get matches</button> */}
      </div>
    </ProtectedRout>
  )
})
export default MsgOrderPage

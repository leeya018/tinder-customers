"use client"
import React, { useEffect, useRef, useState } from "react"
import Navbar from "@/components/navbar"
import ProtectedRout from "@/components/protectedRout"

import { observer } from "mobx-react-lite"
import {
  getMatchesApi,
  getMessagesApi,
  getUserApi,
  removeMatchApi,
  sendMessageApi,
} from "@/api_client"
import { NavNames, modals, sleep, timeBetween } from "@/pages/api/util"
import { data } from "./data"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FaHome } from "react-icons/fa"
import moment from "moment"
import RemoveModal from "@/ui/modal/unmatch"
import { ModalStore } from "@/mobx/modalStore"
import { getProfileApi } from "@/api_client"

const commonMessages = [
  "you look like someone with interesting job, am I right?",
  "what is your job?",
  "I dont like freelancers so I need to know before I see you.",
  "I think that me and you can have a great time together, what do you think?",
  "for now we can exchange numbers",
  "I see you when I get there",
]
const myTinderToken = process.env.NEXT_PUBLIC_MY_TINDER_TOKEN_ID
const mPayload = {
  message: 1, //if there are messages in the pull
  amount: 10, // how many matches to return
  is_tinder_u: true,
  pageToken: null,
}

// const matchId = "5980deb74a75f5b45fb118ee63ecad4f083ea501001fc6db"

const myId = "5980deb74a75f5b45fb118ee"
// const item = data[0]
const MsgOrderPage = observer(() => {
  const [messagesArr, setMessagesArr] = useState<any>([])
  const [txtMsg, setTxtMsg] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [mchPayload, setMchPayload] = useState(mPayload)
  const [imgClicked, setImgClicked] = useState("")
  const [isShowComMsgs, setIsShowComMsgs] = useState<boolean>(false)
  const [dist, setDist] = useState<number>(-1)
  const [chosenToRem, setChosenToRem] = useState({
    name: "",
    matchId: "",
  })
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

  useEffect(() => {
    if (messagesArr.length === 0 && !isLoading && !isDone) {
      getMyMessages()
    } else if (messagesArr.length !== 0) {
      getDist(messagesArr[0]?.id).then((res) => {
        setDist(res)
      })
    }
  }, [messagesArr])

  const getMatches = async () => {
    return await getMatchesApi(myTinderToken, mchPayload)
  }
  // const getUser = async () => {
  //   const user = await getUserApi(myTinderToken, "6240c3faa7299401007624a1")
  //   console.log({ user })
  //   return user
  // }

  const createCustomData = (match: any, messages: any) => {
    const photos = match.person.photos.map((item: any) => item.url)
    const customMessages = messages.map((message: any) => {
      return {
        from: message.from === myId ? "YOU" : match.person.name,
        to: message.to === myId ? "YOU" : match.person.name,
        message: message.message,
        matchId: message.matchId,
      }
    })
    const { _id, bio, name, birth_date } = match.person
    if (!birth_date) throw new Error("birth date is required")
    const age: number = moment().diff(birth_date, "years")
    const data = {
      id: _id,
      age,
      name,
      photos,
      bio,
      messages: customMessages,
      matchId: match._id,
    }
    return data
  }

  const filterMatches = async (matches: any) => {
    let filteredMatches = []
    for (const match of matches) {
      if (!match.id) throw new Error("match id not specified")
      const messages = await getMessagesApi(myTinderToken, match.id)
      const userId = match.person.id
      const firstMessage = messages[0]

      if (firstMessage.from !== myId) {
        // const user = await getUserApi(myTinderToken, userId)
        const newCustomData = createCustomData(match, messages)
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
    sendMessageApi(myTinderToken, payload).catch((err) => {
      console.log(err)
    })
    setTxtMsg("")
  }

  const handleKeyDown = (e: any) => {
    console.log(e.code)
    if (e.code === "Enter") {
      sendMessage()
    } else if (e.code === "Backquote") {
      setMessagesArr((prev: any) => [...prev.slice(1)])
    } else if (e.code === "Slash") {
      setIsShowComMsgs(true)
    }
  }

  const closeModal = () => {
    setChosenToRem({
      name: "",
      matchId: "",
    })
  }

  const openUmatchModal = async (matchId: string, name: string) => {
    setChosenToRem({
      matchId,
      name,
    })
    ModalStore.openModal(modals.unmatch)
  }

  const removeMatch = async () => {
    await removeMatchApi(chosenToRem.matchId, myTinderToken)
    //
    setMessagesArr((prev: any) =>
      prev.filter((msgItem: any) => msgItem.matchId !== chosenToRem.matchId)
    )
    ModalStore.closeModal()
  }

  // match.person.photos.map(item =>item.url)
  // match.person.name
  const getMyMessages = async () => {
    setIsLoading(true)
    console.log("what is up")
    const { matches, next_page_token } = await getMatches()
    console.log({ next_page_token, matches })
    if (!next_page_token) {
      setIsDone(true)
      return
    }
    setMchPayload((prev) => ({
      ...prev,
      pageToken: next_page_token,
    }))
    const results = await filterMatches(matches)
    setIsLoading(false)

    console.log({ results })

    // setMessagesArr(results)
  }

  const chooseMsgOption = (msg: string) => {
    setTxtMsg(msg)
    setIsShowComMsgs(false)
  }

  const getDist = async (userId: any) => {
    if (!userId) return -1

    const otherProfile = await getUserApi(myTinderToken!, userId)
    // console.log(otherProfile.results.distance_mi)
    const kil_mile_ratio = 1.60934
    const otherLocation_mile = otherProfile.results.distance_mi
    const otherLocation_kilometer = otherLocation_mile * kil_mile_ratio

    return otherLocation_kilometer.toFixed(0)
  }

  if (messagesArr.length === 0) {
    return (
      <div className="flex justify-center items-center bg-pink-400 w-full h-screen flex-col">
        <div className="text-5xl font-semibold  text-white">
          We are loading ...
        </div>
      </div>
    )
  }
  if (isDone) {
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
      {imgClicked !== "" && (
        <div className="absolute z-10  inset-0 bg-gray-400 bg-opacity-30 flex items-center justify-center">
          <Image
            alt="girl image "
            width={600}
            height={600}
            className="object-fit "
            src={imgClicked}
            onClick={() => setImgClicked("")}
          />
        </div>
      )}
      {ModalStore.modalName === modals.unmatch && (
        <RemoveModal
          onClose={closeModal}
          title="unmatch"
          chosenToRem={chosenToRem}
          onClick={removeMatch}
        />
      )}
      <div className=" container max-h-screen p-10 my-20 relative ">
        {/* images */}
        <ul className="flex justify-between flex-wrap gap-2">
          {(messagesArr[0]?.photos || []).map((url: string, key: number) => (
            <li key={key} onClick={() => setImgClicked(url)}>
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
        <div className="flex items-center gap-10">
          <div className="mt-10">
            <span className="font-semibold">name: </span>
            {messagesArr[0]?.name}
          </div>
          <button
            onClick={() =>
              openUmatchModal(messagesArr[0].matchId, messagesArr[0].name)
            }
            className="text-white bg-red-500 hover:text-red-500 hover:bg-white rounded-lg px-5 py-3"
          >
            remove match
          </button>
        </div>

        <div className="mt-10">
          <span className="font-semibold">age: </span>
          {messagesArr[0]?.age}
        </div>

        <div className="mt-10">
          <span className="font-semibold">distance: </span>
          {dist} km
        </div>

        <div className="mt-10 lg:w-[50%] ">{messagesArr[0]?.bio}</div>

        {/* message send section */}
        <div className=" flex  ">
          <div className="mt-5 flex items-center h-14 gap-2 lg:w-[50%] ">
            <div>
              <input
                value={txtMsg}
                onChange={(e) => setTxtMsg(e.target.value)}
                ref={inputRef}
                type="text"
                className="border-2 rounded-lg h-full flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyDown={handleKeyDown}
              />
              {/* options message */}
              {isShowComMsgs && (
                <ul className="flex flex-col bg-slate-100 absolute z-10">
                  {commonMessages.map((commonMessage, key) => (
                    <li
                      key={key}
                      className="hover:bg-gray-500 flex items-center p-2 "
                      onClick={() => chooseMsgOption(commonMessage)}
                    >
                      {commonMessage}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={sendMessage}
              className="text-white bg-blue-500 hover:text-blue-500 hover:bg-white rounded-lg px-5 py-3"
            >
              send message
            </button>
          </div>
        </div>
        {/* messages */}
        <ul
          className="flex flex-col  gap-3 border-2 max-h-96 overflow-scroll mt-10 "
          ref={scrollRef}
        >
          {(messagesArr[0]?.messages || []).map((message: any, key: number) => (
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

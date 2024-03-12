import Image from "next/image"
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Modal from "."
import { Timestamp } from "firebase/firestore"
import { FcApproval } from "react-icons/fc"
import { ModalStore } from "@/mobx/modalStore"
type ModalProps = {
  title: string
  chosenToRem: any
  onClick: () => void
  onClose: () => void
}
const UnmatchModal: FC<ModalProps> = observer(
  ({ onClose, onClick, title, chosenToRem }) => {
    // console.log({ messageArr })

    const closeModal = () => {
      onClose()
      ModalStore.closeModal()
    }
    return (
      <Modal>
        <div className="py-4 px-8 flex flex-col items-center justify-around gap-5 h-full  w-full ">
          <FcApproval size={85} />
          <div className="flex flex-col items-center gap-2">
            <div className="font-bold text-2xl ">{title}</div>

            <div>Are you sure you want to unmatch {chosenToRem.name}</div>
          </div>
          <div>
            <button
              onClick={closeModal}
              className="  border-color-blue border-2 bg-color-blue text-color-white rounded-md py-2 px-4 cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={() => onClick()}
              className="  border-color-blue border-2 bg-color-blue text-color-white rounded-md py-2 px-4 cursor-pointer"
            >
              REMOVE
            </button>
          </div>
        </div>
      </Modal>
    )
  }
)
export default UnmatchModal

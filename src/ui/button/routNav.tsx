import React, { FC, useState } from "react"
import { FaRegArrowAltCircleRight } from "react-icons/fa"

type ButtonPropType = {
  children: React.ReactNode
  onClick: any
}

const NavRout: FC<ButtonPropType> = ({ children, onClick }) => {
  return (
    <div
      className="absolute top-1 left-1 cursor-pointer flex justify-center items-center gap-2 p-2"
      onClick={onClick}
    >
      <div className="capitalize">To {children}</div>
      <FaRegArrowAltCircleRight size={25} />
    </div>
  )
}

export default NavRout

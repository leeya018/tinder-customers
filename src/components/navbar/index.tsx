import * as React from "react"
import { observer } from "mobx-react-lite"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase"
import { NavNames } from "@/pages/api/util"
import navStore from "@/mobx/navStore"
import Image from "next/image"
import userStore from "@/mobx/userStore"

const Navbar = observer(() => {
  const router = useRouter()

  const logout = async () => {
    try {
      await signOut(auth)

      console.log("user Logged out")
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleNavItemClick = (name: string) => {
    navStore.setNav(name)
    router.push(name)
  }

  return (
    <nav className="px-8 py-3 bg-blue-500 text-white fixed top-0 w-screen flex z-10 items-center justify-between">
      {/*  nav */}
      <ul className="flex items-center gap-2">
        <li
          onClick={() => handleNavItemClick(NavNames.home)}
          className={`${
            navStore.nav === NavNames.home && "underline"
          } p-2 hover:underline cursor-pointer`}
        >
          home
        </li>
        <li
          onClick={() => handleNavItemClick(NavNames.info)}
          className={`${
            navStore.nav === NavNames.info && "underline"
          } p-2 hover:underline cursor-pointer`}
        >
          info
        </li>
        <li
          onClick={() => handleNavItemClick(NavNames.msgorder)}
          className={`${
            navStore.nav === NavNames.msgorder && "underline"
          } p-2 hover:underline cursor-pointer`}
        >
          msgOrder
        </li>

        <li>
          <div
            className="cursor-pointer flex justify-center border-2
           items-center bg-pink-600 text-white text-lg
             px-5 py-2 rounded-full hover:bg-white 
             hover:borer-pink-600   hover:text-pink-600
              hover:border-pink-600 duration-300
             "
          >
            <a
              href="https://tinder-analitics.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              to analitics site
            </a>
          </div>
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          src={userStore.user?.photoURL}
          width={50}
          height={50}
          alt="Profile image"
        />
        <div className="cursor-pointer" onClick={logout}>
          logout
        </div>
      </div>
    </nav>
  )
})
export default Navbar

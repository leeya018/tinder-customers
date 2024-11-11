import * as React from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { NavNames } from "@/pages/api/util";
import navStore from "@/mobx/navStore";
import Image from "next/image";
import userStore from "@/mobx/userStore";

const Navbar = observer(() => {
  const router = useRouter();
  const [showLogout, setShowLogout] = React.useState(false);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      setShowLogout(false); // Hide logout button after logging out
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleNavItemClick = (name: string) => {
    navStore.setNav(name);
    router.push(name);
  };

  const toggleLogoutButton = () => {
    setShowLogout((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white fixed top-0 w-full py-3 px-8 flex items-center justify-between shadow-lg z-10">
      {/* Navigation Links */}
      <ul className="flex items-center space-x-4">
        <li
          onClick={() => handleNavItemClick(NavNames.home)}
          className={`${
            navStore.nav === NavNames.home ? "underline font-semibold" : ""
          } cursor-pointer transition duration-300 hover:underline`}
        >
          Home
        </li>
        <li
          onClick={() => handleNavItemClick(NavNames.view)}
          className={`${
            navStore.nav === NavNames.view ? "underline font-semibold" : ""
          } cursor-pointer transition duration-300 hover:underline`}
        >
          Info
        </li>
        <li
          onClick={() => handleNavItemClick(NavNames.msgorder)}
          className={`${
            navStore.nav === NavNames.msgorder ? "underline font-semibold" : ""
          } cursor-pointer transition duration-300 hover:underline`}
        >
          MsgOrder
        </li>
        <li>
          <a
            href="https://tinder-analitics.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300 shadow-lg"
          >
            To Analytics Site
          </a>
        </li>
      </ul>

      {/* User Profile and Conditional Logout */}
      <div className="flex items-center space-x-3 relative">
        <Image
          className="rounded-full border-2 border-white shadow-lg cursor-pointer"
          src={userStore.user?.photoURL}
          width={40}
          height={40}
          alt="Profile image"
          onClick={toggleLogoutButton}
        />
        {showLogout && (
          <div
            className="absolute top-12 right-0 px-3 py-1 rounded-lg bg-red-500 text-white font-semibold cursor-pointer shadow-md transition duration-300 hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </div>
        )}
      </div>
    </nav>
  );
});

export default Navbar;

import { User } from "@/api/firestore/user/interfaces"
import { makeAutoObservable } from "mobx"
import { makePersistable } from "mobx-persist-store"

class UserS {
  user: any | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setUser = (newUser: User) => {
    this.user = newUser
  }
}

const userStore = new UserS()
export default userStore

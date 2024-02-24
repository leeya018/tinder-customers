import { addUser as addUserFirestore } from "./user/addUser"
import { getMessages as getMessagesFirestore } from "./message/getMessages"
import { addMessageCount as addMessageCountFirestore } from "./message/addMessageCount"
import { getLikes as getLikesFirestore } from "./like/getLikes"
import { addLike as addLikeFirestore } from "./like/addLike"
import { getCustomers as getCustomersFirestore } from "./customer/getCustomers"
import { addInfo as addInfoFirestore } from "./info/addInfo"

export {
  addUserFirestore,
  getMessagesFirestore,
  addMessageCountFirestore,
  getLikesFirestore,
  addLikeFirestore,
  getCustomersFirestore,
  addInfoFirestore,
}

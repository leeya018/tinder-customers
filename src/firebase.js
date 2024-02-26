// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { isDev } from "./pages/api/util"
// import { getStorage } from "firebase/storage"

// import * as admin from "firebase-admin"

const firebaseConfigDev = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY_DEV,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN_DEV,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID_DEV,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_DEV,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID_DEV,
  appId: process.env.NEXT_PUBLIC_APP_ID_DEV,
}

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       // Your service account details
//       projectId: process.env.NEXT_PUBLIC_APP_ID_DEV,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     }),
//   })
// }

const app = initializeApp(firebaseConfigDev)
export const db = getFirestore(app)
export const auth = getAuth(app)
// export const adminFirbase = admin

// export const dbServer = admin.firestore()
// export const storage = getStorage(app)

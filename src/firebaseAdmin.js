export const getAdminDb = async () => {
  const firebaseAdmin = await import("firebase-admin")

  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID_DEV,
        clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
        privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.NEXT_PUBLIC_DB_URL,
    })
  }

  const db = firebaseAdmin.firestore()
  return db
}

// export const db = await getAdmin()

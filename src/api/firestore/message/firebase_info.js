querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});

// forEach is of the firesotre, expose the data .

const documents = querySnapshot.docs;
//  convert them to array to interate

const collectionRef = collection(db, "customers");
// get ref to collection name ,

getDocs(collectionRef);
// get them by sending collection ref to function

const userDocRef = doc(db, "customers", customerId);
//  get doc ref by id of the doc .

const userDocSnap = await getDoc(userDocRef);
// getting the doc object by its docRef

userDocSnap.exists();
// check if the doc snapshot exists

await setDoc(docRef, customer);
// update docRef by new data from customer

userDocSnap.data();
// get the doc data . because without the data() . its not parsed yet.

const q = query(
  messageCollectionRef,
  where("userId", "==", userId),
  where("createdDate", ">=", Timestamp.fromDate(startOfDay)),
  where("createdDate", "<", Timestamp.fromDate(endOfDay))
);
// create a query with a collection ref and then all the Where clauses you want

where("createdDate", "<", Timestamp.fromDate(endOfDay));
//  where clause , 3 inputs: fieldName, arg, and the value
//  where(fieldName, argumentCompare, value)

// Timestamp is Object imported from firebase/firestore and helping handle dates

await updateDoc(doc(db, "likes", documentToUpdate.id), {
  likeUrls: arrayUnion(likeUrl),
});
// update the doc by giving it the doc ref , and then an Object
//  updateDoc is updating ONLY the fields that are menttioned in the new Obj,
// arrayUnion function is helping to merge between the former likesUrls and the new one into one array .

const querySnapshot = await q.get();
// when I want to excecute a query which I allrady created

const docRef = await addDoc(messageCollectionRef, {
  userId,
  createdDate,
  likeUrls: [likeUrl],
});
// add a new doc to ssytem, by sending it the collectionRef and the Object to add

console.log(doc.id, " => ", doc.data());
//  to get the Object out of the doc  , we are using .data() function to get all its fiedls.
//  and inorder to get the id of the doc, we are using the .id field.

import { serverTimestamp } from "firebase/firestore";
createdDate: serverTimestamp();
// serverTimestamp() is a firestore function that helps us to create a date in the firestore format .
//  its makeing the time , when the doc is really created on the server and not when the user creates it .

amount: increment(1);
// a increment function enable me to increase the value of an object in the collection without getting it out first .

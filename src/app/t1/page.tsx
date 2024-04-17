"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

export default function page() {
  return <div></div>;
}

// =================================== SLICE VS SPLICE===========================================
// export default function page() {
//   const [chosenInd, setchosenInd] = useState(0);
//   const [list, setlist] = useState([1, 2, 3, 4, 5]);
//   const [itemsToRem, setitemsToRem] = useState(1);
//   console.log({ itemsToRem, chosenInd });

//   const slice = () => {
//     const part1 = list.slice(0, ind);
//     const part2 = list.slice(ind + 1);
//     console.log(part1, part2);
//     setlist([...part1, ...part2]);
//   };
//   const splice = () => {
//     let dupList = [...list];
//     dupList.splice(chosenInd, itemsToRem);
//     setitemsToRem(1);

//     setlist(dupList);
//   };
//   return (
//     <div>
//       <div>diff between slice and splice</div>
{
  /* <div>the main diff is that SPLICE is changing the arr it self, get 2 parmas, first is the index to start and the sec param is how many items to remove</div> */
}
//       <div>
//         <ul className="flex items-center">
//           {list.map((item, key) => (
//             <li key={key}>{item} ,</li>
//           ))}
//         </ul>
//       </div>
//       <div className="flex flex-col w-44">
//         <input
//           className="p-2 rounded-md border-2"
//           type="number"
//           placeholder="choose index"
//           value={chosenInd}
//           onChange={(e) => setchosenInd(e.target.value)}
//         />
//         <button onClick={slice}>silce</button>
//         <div>
//           <div>
//             in splice the funciton is getting the index and the amount of items
//             you want to remove after the index .{" "}
//           </div>
//           <input
//             className="p-2 rounded-md border-2"
//             type="number"
//             placeholder="amount of ietms to rem "
//             value={itemsToRem}
//             onChange={(e) => setitemsToRem(e.target.value)}
//           />

//           <button onClick={splice}>splice</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ============================================COUNTER =================================================
// const T1 = observer(() => {
//   const [data, setData] = useState("");
//   const [list, setList] = useState([]);

//   const [chosenKey, setChosenKey] = useState(-1);
//   useEffect(() => {}, []);

//   const addData = () => {
//     setList((prev) => [...prev, data]);
//     setData("");
//   };

//   const removeData = (ind) => {
//     // const items = list.slice(0, ind).concat(list.slice(ind + 1));
//     // console.log(list.slice(0, ind));
//     // console.log(list.slice(ind + 1));
//     // setList(items);
//     const items = list.filter((_, key) => ind !== key);
//     setList(items);
//   };

//   const handleKeyDown = (e, ind) => {
//     console.log(e.code);
//     if (e.code === "Enter") {
//       const items = list.map((item, key) => (key === ind ? data : item));

//       setList(items);
//       setChosenKey(-1);
//     }
//   };
//   const handleMainInputPress = (e) => {
//     console.log(e.code);
//     if (e.code === "Enter") {
//       addData();
//     }
//   };
//   return (
//     <div>
//       <div>this is list</div>
//       <div className="flex gap-2">
//         <input
//           className="border-2 p-2 rounded-md"
//           type="text"
//           value={data}
//           placeholder="add data"
//           onChange={(e) => setData(e.target.value)}
//           onKeyDown={handleMainInputPress}
//         />
//         <button onClick={addData}>add data</button>
//       </div>
//       <div>
//         <ul className="flex flex-col gap-2">
//           {list.map((item, key) => (
//             <li key={key} className="flex items-center gap-2">
//               {chosenKey == key ? (
//                 <input
//                   className="border-2 p-2 rounded-md"
//                   type="text"
//                   value={data}
//                   placeholder="add data"
//                   onChange={(e) => setData(e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(e, key)}
//                 />
//               ) : (
//                 <div
//                   onClick={() => {
//                     setChosenKey(key);
//                     setData(item);
//                   }}
//                 >
//                   {item}
//                 </div>
//               )}

//               <button onClick={() => removeData(key)}>remove</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// });

// export default T1;

// ============================================COUNTER =================================================
// "use client";
// import React, { useEffect, useState } from "react";
// import { observer } from "mobx-react-lite";
// import { getDataFromGptLearnApi, getDataFromGptTrainApi } from "@/api_client";

// const T1 = observer(() => {
//   const [counter, setCounter] = useState(0);
//   useEffect(() => {}, []);
//   return (
//     <div>
//       <div>this is a countr</div>
//       <button onClick={() => setCounter((p) => p + 1)}>up</button>
//       <div>{counter}</div>
//       <button onClick={() => setCounter((p) => p - 1)}>down</button>
//     </div>
//   );
// });

// export default T1;

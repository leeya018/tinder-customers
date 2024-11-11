"use client";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import { Button, OutlinedInput } from "@mui/material";
import { observer } from "mobx-react-lite";
import Alerts from "@/ui/Alerts";
import { messageStore } from "@/mobx/messageStore";
import MessageModal from "@/ui/modal/message";
import { ModalStore } from "@/mobx/modalStore";
import {
  infoTypes,
  instructions,
  modals,
  sleep,
  timeBetween,
} from "@/pages/api/util";
import tokensStore, { Token } from "@/mobx/tokenStore";
import { useRouter } from "next/navigation";

import ProtectedRout from "@/components/protectedRout";
import Navbar from "@/components/navbar";
import CustomerCommand from "@/components/customerCommand";
import { startApi } from "@/api_client";
import LoadXls from "@/components/loadXls";
import { CustomerStore, customerStatus } from "@/mobx/customerStore";
import { toJS } from "mobx";

import { addInfo } from "@/api/firestore/info/addInfo";
import { info } from "@/api/firestore/info/interfaces";
import { addInfoFirestore } from "@/api/firestore";
import { getMyLikesApi } from "@/node/api";

const RootPage = observer(() => {
  const router = useRouter();

  // this funciton invoke start function in loop
  // each time for different customer .
  // when its done with all it will start another rotation for all
  // useEffect(() => {
  //   const cXlsData = CustomerStore.customersXlsData
  //   console.log({ cXlsData: toJS(cXlsData) })
  //   start(cXlsData, 0)
  // }, [])

  // useEffect(() => {
  //   getMyLikesApi();
  // }, []);

  const startAll = async () => {
    debugger;
    let i = 0;
    let condition = true;
    while (condition) {
      for (const [
        index,
        cXlsData,
      ] of CustomerStore.customersXlsData.entries()) {
        // console.log({ index, cXlsData: toJS(cXlsData) })
        // await sleep(5)

        //  this is ithe real code
        const name = await start(cXlsData, index);
        console.log(`finish iteration for ${name}`);
        // await sleep(30)
      }
      i++;
      console.log(`done interation for all. iteration number: ${i}`);
      await sleep(timeBetween.SESSION_USERS); //session
    }
  };

  const start = async (customerXlsData: any, index: number) => {
    try {
      const name = await startApi(customerXlsData);
      CustomerStore.updateCustomersXls(index, {
        status: customerStatus.success,
      });
      return name;
    } catch (error: any) {
      console.log(error.stack);
      CustomerStore.updateCustomersXls(index, {
        status: customerStatus.failed,
      });
      throw error;
    }
  };
  // const addInfo = () => {
  //   try {
  //     const info: info = {
  //       customerName: "customer.name",
  //       data: "firstImage",
  //       type: infoTypes.LIKE,
  //     }
  //     addInfoFirestore(info)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  return (
    <ProtectedRout>
      <Navbar />
      <div className="w-full min-h-screen p-10 bg-gray-50 flex flex-col items-center">
        {/* Alerts Section */}
        <div className="w-full max-w-4xl">
          <Alerts />
        </div>

        {/* Load XLS Section */}
        <div className="w-full max-w-4xl mt-16 flex flex-col items-center">
          <LoadXls
            callback={(json: Object) => {
              CustomerStore.setCustomersXls(json);
            }}
          />
        </div>

        {/* Start All Button */}
        <div className="w-full max-w-4xl mt-8 flex justify-end">
          <Button
            className={`h-10 px-6 rounded-lg shadow-md transition-all duration-300 ${
              CustomerStore.customersXlsData.length > 0
                ? "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            variant="outlined"
            disabled={CustomerStore.customersXlsData.length === 0}
            onClick={startAll}
          >
            Start All
          </Button>
        </div>

        {/* Customer List */}
        <div className="w-full max-w-4xl mt-10 bg-white rounded-lg shadow-lg overflow-auto p-6">
          <ul className="space-y-4">
            {CustomerStore.customersXlsData.map(
              (customerXlsData: any, key: number) => (
                <li
                  key={key}
                  className="bg-gray-100 rounded-lg shadow p-4 hover:bg-gray-200 transition duration-300"
                >
                  <CustomerCommand
                    index={key}
                    customerXlsData={customerXlsData}
                    onClick={start}
                  />
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </ProtectedRout>
  );
});

export default RootPage;

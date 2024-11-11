"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { FcApproval } from "react-icons/fc";
import { instructions } from "@/pages/api/util";
import Navbar from "@/components/navbar";
import ProtectedRout from "@/components/protectedRout";

const AboutPage = observer(() => {
  return (
    <ProtectedRout>
      <Navbar />
      <div className="w-[100vw] h-[100vh] mb-2 p-10">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <FcApproval size={55} />
            <div className="font-bold text-2xl ">Benefits</div>
          </div>

          <ul className="flex flex-col gap-5 list-disc  ">
            {instructions.map((message: string, key: number) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRout>
  );
});
export default AboutPage;

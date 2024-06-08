import MermaidChart from "@/components/MermaidChart";
import Summary from "@/components/Summary";
import { getSummary } from "@/lib/getSummary";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    chatId: number;
  };
};

const page = async ({ params: { chatId } }: Props) => {
  const text = await getSummary(chatId);
  if (!text)
    return (
      <div className="flex h-screen justify-center items-center">
        Some Error occured while generating Please Refresh (cmd/cntrl + R)
      </div>
    );
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-2">
      <div>
        <Summary text={text} />
      </div>
      <Link href={`/flowchart/${chatId}`}>
        <button className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Get AI-Generated Flow-Chart for your PDF
          </div>
        </button>
      </Link>
    </div>
  );
};

export default page;

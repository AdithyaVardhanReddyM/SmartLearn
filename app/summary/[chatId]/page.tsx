import MarkdownRenderer from "@/components/MarkdownRenderer";
import MermaidChart from "@/components/MermaidChart";
import Summary from "@/components/Summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getQuiz } from "@/lib/getQuiz";
import { getSummary } from "@/lib/getSummary";
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
      <div className="w-5/6">
        <MermaidChart chatId={chatId} />
      </div>
    </div>
  );
};

export default page;

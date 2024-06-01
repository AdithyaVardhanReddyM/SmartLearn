import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { FileText, Loader2 } from "lucide-react";

type Props = {
  messages: Message[];
};

const MessageList = ({ messages }: Props) => {
  if (messages.length == 0)
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500">
        <FileText className="w-12 h-12 mb-4 text-blue-500/70" />
        <h1 className="text-2xl font-bold">Welcome to SmartLearn!</h1>
        <p className="text-lg mt-2">Ask AI about the PDF to get started.</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-2 px-4 h-full">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "system",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10 bg-purple text-black",
                {
                  "bg-blue-600 text-white": message.role === "user",
                }
              )}
            >
              <MarkdownRenderer content={message.content} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;

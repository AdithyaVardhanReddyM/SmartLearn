import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { MessageCircleMore, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-white text-sm bg-black-100 border-r-2 border-r-pink-500 ">
      <Link href="/dashboard">
        <button className="bg-slate-800 w-full no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1.5 px-4 ring-1 ring-white/10 justify-center">
            <PlusCircle className="w-4 h-4 mr-1" />
            <p className="text-sm">New Chat</p>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </Link>
      <p className="mt-4 text-purple">Previous Chats</p>
      <div className="flex flex-col mt-4 gap-5">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg flex w-full items-center p-1", {
                "bg-pink-500": chat.id == chatId,
                "border-[1px] border-dashed border-purple hover:text-pink-500":
                  chat.id != chatId,
              })}
            >
              <MessageCircleMore className="ml-1 mr-2 h-4 w-4" />
              <p className="overflow-hidden truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="flex gap-3 justify-between items-center border-[1px] p-2 rounded-md bg-black-100 bg-opacity-85">
          <Link href={"/"} className="text-purple">
            Home
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;

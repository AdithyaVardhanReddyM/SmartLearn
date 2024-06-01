import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import QuizandSummary from "@/components/QuizandSummary";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: number;
  };
};

const page = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    // toast.error("Please Upload a PDF to start a chat");
    return redirect("/dashboard");
  }
  if (!_chats.find((chat) => chat.id == chatId)) {
    // toast.error("Internal error, try re-uploading");
    return redirect("/dashboard");
  }

  const currentChat = _chats.find((chat) => chat.id == chatId);
  return (
    <div className="flex bg-black">
      <div className="flex w-full min-h-screen">
        <div className="flex w-1/6">
          <ChatSideBar chats={_chats} chatId={chatId} />
        </div>
        <div className="h-screen p-4 flex-1">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        <div className="w-1/3 border-l-2 border-l-pink-500 h-screen">
          <div className="h-[12.5%] p-2 ">
            <QuizandSummary chatId={chatId} />
          </div>
          <div className="h-[87.5%] ">
            <ChatComponent chatId={chatId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

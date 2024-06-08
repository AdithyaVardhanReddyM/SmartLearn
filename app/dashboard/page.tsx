import PdfUpload from "@/components/PdfUpload";
import GoToChats from "@/components/GoToChats";

import { WavyBackground } from "@/components/ui/wavy-background";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <WavyBackground className="max-w-4xl mx-auto">
        <p className="text-2xl md:text-4xl lg:text-5xl text-white font-bold inter-var text-center">
          Upload a PDF to get started
        </p>
        <p className="text-base md:text-lg my-4 text-white font-normal inter-var text-center">
          Leverage the power of AI in your learning journey
        </p>
        <div className="flex gap-3 items-center justify-center">
          <PdfUpload />
          {_chats.length !== 0 && <p className="font-bold text-lg">Or</p>}
          {_chats.length !== 0 && <GoToChats />}
        </div>
      </WavyBackground>
    </div>
  );
};

export default page;

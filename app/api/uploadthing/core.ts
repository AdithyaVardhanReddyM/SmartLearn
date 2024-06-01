import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadPdfIntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // This code runs on your server before upload
      const { userId } = auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await loadPdfIntoPinecone(file.url, file.key);
      const chat_id = await db
        .insert(chats)
        .values({
          fileKey: file.key,
          pdfName: file.name,
          pdfUrl: file.url,
          userId: metadata.userId,
        })
        .returning({ insertedId: chats.id });

      if (!chat_id) console.log("error getting chatid");
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { chat_id: chat_id[0].insertedId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

"use server";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { chats } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

export async function getChatId() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId!));
  let chatId = _chats[0].id;
  return chatId;
}

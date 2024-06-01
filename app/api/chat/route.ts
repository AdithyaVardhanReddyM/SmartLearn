import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { getContext } from "@/lib/getcontext";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
  if (_chats.length != 1) {
    return NextResponse.json({ error: "chat not found" }, { status: 404 });
  }
  const fileKey = _chats[0].fileKey;
  const lastMessage = messages[messages.length - 1];
  const context = await getContext(lastMessage.content, fileKey);

  const prompt = {
    role: "system",
    content: `
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account CONTEXT BLOCK that is provided in a conversation and takes into account of CONTEXT and QUERY and gives the relevant "detailed" answer.
    If the context does not provide the answer to question, the AI assistant use its knowledge to give information and say "But can't retrieve exact information from PDF".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    `,
  };

  const result = await streamText({
    model: google("models/gemini-1.5-pro-latest"),
    messages: [prompt, ...messages],
    onFinish: async () => {
      await db.insert(_messages).values({
        chatId,
        content: lastMessage.content,
        role: "user",
      });
      await db.insert(_messages).values({
        chatId,
        content: await result.text,
        role: "system",
      });
    },
  });
  return result.toAIStreamResponse();
}

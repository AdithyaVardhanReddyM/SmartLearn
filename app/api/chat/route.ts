import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { getContext } from "@/lib/getcontext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages, chatId }: { messages: any[]; chatId: number } =
      await req.json();

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    const systemInstruction = {
      role: "model" as const,
      parts: [
        {
          text: `You are a helpful AI assistant. Use this context when answering:
${context || "No specific context available"}

If the question isn't answered by the context, say:
"I couldn't find that in the document, but here's what I know:"`,
        },
      ],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      systemInstruction,
    });

    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 4096,
      },
    });

    const result = await chat.sendMessageStream(lastMessage.content);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullResponse = "";

        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullResponse += chunkText;
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                id: Date.now().toString(),
                role: "system",
                content: chunkText,
              })}\n\n`
            )
          );
        }

        // Save to database
        await db.insert(_messages).values([
          {
            chatId,
            content: lastMessage.content,
            role: "user",
          },
          {
            chatId,
            content: fullResponse,
            role: "system",
          },
        ]);

        // Send final message with complete flag
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              id: "complete",
              role: "system",
              content: fullResponse,
              complete: true,
            })}\n\n`
          )
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

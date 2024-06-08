import { eq } from "drizzle-orm";
import { db } from "./db";
import { chats } from "./db/schema";
import { GetPdftolocal } from "./getpdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function getQuiz(chatId: number) {
  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
  const pdfUrl = _chats[0].pdfUrl;

  const file_name = await GetPdftolocal(pdfUrl);
  if (!file_name) {
    throw new Error("could not download the pdf");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];
  const data = pages
    .slice(0, 5)
    .map((page) => page.pageContent)
    .join("")
    .replace(/\n/g, "");

  const amount = 8;
  try {
    const result = await generateObject({
      model: google("models/gemini-1.5-flash-latest"),
      prompt: `Generate an array of multiple-choice questions (MCQs) (Do not use apostrophes for keys.) on the topic: ${data} in the amount: ${amount}. Return the output in JSON format. Ensure that only the values are enclosed in double quotes (""), and the keys are not enclosed in any quotes. Use the following format for the JSON object:
      [
        {
          question: "Your question here",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          answer: "Correct answer"
        },
        ...
      ]
      Do not use apostrophes for keys.`,
      schema: z.array(
        z.object({
          question: z.string().describe("the question here"),
          options: z
            .array(z.string())
            .describe("4 options here including correct answer"),
          correctAnswer: z.number().describe("index of correct answer"),
        })
      ),
    });

    const responses = result.object;
    return responses;
  } catch (error) {}
}

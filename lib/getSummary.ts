import { eq } from "drizzle-orm";
import { db } from "./db";
import { chats } from "./db/schema";
import { GetPdftolocal } from "./getpdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function getSummary(chatId: number) {
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

  try {
    const result = await generateText({
      model: google("models/gemini-1.5-flash-latest"),
      prompt: `Generate a summary using the data : ${data}`,
    });

    const responses = result.text;
    return responses;
  } catch (error) {}
}

export async function getMermaid(chatId: number) {
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

  try {
    const result = await generateText({
      model: google("models/gemini-1.5-flash-latest"),
      prompt: `Generate only mermaid code (Important: No parentesis () anywhere in the code ), no text summarizing using the data : ${data}\n only mermaid code, no text. Strict Instruction: No parentesis () or [] inside blocks`,
    });

    const responses = result.text;
    return responses;
  } catch (error) {}
}

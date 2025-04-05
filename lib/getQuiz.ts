import { eq } from "drizzle-orm";
import { db } from "./db";
import { chats } from "./db/schema";
import { GetPdftolocal } from "./getpdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const schema = z.array(
  z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
  })
);

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

  const prompt = `
Generate an array of ${amount} multiple-choice questions (MCQs) on the topic below. 

**Instructions:**
- Return the output as a JSON array.
- Do not use apostrophes in keys.
- Each object should have:
  - question (string)
  - options (array of 4 strings, including the correct answer)
  - correctAnswer (index of correct option, starting from 0)

**Topic:**
${data}

**Output Format:**
[
  {
    question: "Your question here",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correctAnswer: 2
  },
  ...
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Remove markdown ```json wrapper if present
    const cleaned = text.replace(/^```json|```$/gim, "").trim();

    const parsed = JSON.parse(cleaned);
    const validated = schema.parse(parsed);
    return validated;
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    return undefined;
  }
}

import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GetPdftolocal } from "./getpdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embedd";
import md5 from "md5";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadPdfIntoPinecone(fileurl: string, fileKey: string) {
  // 1. Downloading the pdf -> parse and split page wise.
  console.log("downloading pdf into file system");
  const file_name = await GetPdftolocal(fileurl);
  if (!file_name) {
    throw new Error("could not download the pdf");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  const documents = await Promise.all(pages.map(processDocument_2));

  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // uploading to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("smartlearn");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  try {
    await namespace.upsert(vectors);
  } catch (error) {
    console.log(error);
  }

  return documents[0];
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

async function processDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}

async function processDocument_2(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  const chunkSize = 400;
  const chunks = [];
  for (let i = 0; i < pageContent.length; i += chunkSize) {
    const chunk = pageContent.substr(i, chunkSize);
    chunks.push(chunk);
  }

  const docsPromises = chunks.map(async (chunk) => {
    const pageNumber = metadata.loc.pageNumber;
    // const text = truncateStringByBytes(chunk, 36000);
    return new Document({
      pageContent: chunk,
      metadata: {
        pageNumber: pageNumber,
        text: chunk,
      },
    });
  });

  const docs = await Promise.all(docsPromises);
  return docs;
}

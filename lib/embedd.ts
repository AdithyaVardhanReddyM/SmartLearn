const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function getEmbeddings(text: string) {
  try {
    const response = await cohere.embed({
      texts: [text.replace(/\n/g, " ")],
      model: "embed-english-v3.0",
      inputType: "search_document",
    });
    const result = await response.embeddings[0];
    return result;
  } catch (error) {
    console.log("error calling cohere-ai embeddings api", error);
    throw error;
  }
}

export async function getEmbeddings_search(text: string) {
  try {
    const response = await cohere.embed({
      texts: [text.replace(/\n/g, " ")],
      model: "embed-english-v3.0",
      inputType: "search_query",
    });
    const result = await response.embeddings[0];
    return result;
  } catch (error) {
    console.log("error calling cohere-ai embeddings api", error);
    throw error;
  }
}

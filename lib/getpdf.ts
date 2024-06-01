import fs from "fs";
import path from "path";
import axios from "axios";

export async function GetPdftolocal(pdfUrl: string): Promise<string> {
  try {
    // Generate a temporary file path
    const fileName = `pdf-${Date.now()}.pdf`;
    const filePath = path.join("/tmp", fileName);

    // Create a write stream to the temporary file
    const writer = fs.createWriteStream(filePath);

    // Make a request to download the PDF
    const response = await axios({
      url: pdfUrl,
      method: "GET",
      responseType: "stream",
    });

    // Pipe the response data to the write stream
    response.data.pipe(writer);

    // Return a promise that resolves to the file path once the download is complete
    await new Promise<void>((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Return the file path
    return filePath;
  } catch (error) {
    console.error("Error downloading the PDF:", error);
    throw error;
  }
}

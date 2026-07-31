import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractResumeText(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      // pdf-parse inserts "-- N of M --" page-break markers between pages;
      // strip them so they don't feed into the agent as resume content.
      return result.text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "").trim();
    } finally {
      await parser.destroy();
    }
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (ext === "txt") {
    return buffer.toString("utf-8").trim();
  }

  throw new Error(`Unsupported resume file type ".${ext}". Supported: pdf, docx, txt.`);
}

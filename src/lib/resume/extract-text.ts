import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

export async function extractResumeText(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    // unpdf ships its own serverless-safe PDF.js build with no separate
    // worker file to resolve — pdf-parse's pdfjs-dist worker file isn't
    // reliably included in Vercel's function bundle (confirmed broken in
    // production: 500s despite working locally), so this avoids that class
    // of failure entirely instead of patching around it.
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text.trim();
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

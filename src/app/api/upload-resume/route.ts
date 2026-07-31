import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSupabaseServerClient, RESUMES_BUCKET } from "@/lib/supabase/server";
import { extractResumeText } from "@/lib/resume/extract-text";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file upload (field name: file)." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: `Unsupported file type ".${ext}". Allowed: ${ALLOWED_EXTENSIONS.join(", ")}.` },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let resumeText: string;
  try {
    resumeText = await extractResumeText(buffer, file.name);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to extract resume text." },
      { status: 400 }
    );
  }

  if (!resumeText || resumeText.length < 30) {
    return NextResponse.json(
      { error: "Could not extract meaningful text from this resume file." },
      { status: 400 }
    );
  }

  const storagePath = `${randomUUID()}.${ext}`;
  const supabase = getSupabaseServerClient();
  const { error: uploadError } = await supabase.storage.from(RESUMES_BUCKET).upload(storagePath, buffer, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: `Failed to store resume: ${uploadError.message}` }, { status: 500 });
  }

  return NextResponse.json({ resumeStoragePath: storagePath, resumeText });
}

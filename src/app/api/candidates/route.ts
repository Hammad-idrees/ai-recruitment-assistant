import { NextResponse } from "next/server";
import { listCandidateHistory } from "@/lib/data/candidates";

export const runtime = "nodejs";

export async function GET() {
  try {
    const history = await listCandidateHistory();
    return NextResponse.json(history);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load history." },
      { status: 500 }
    );
  }
}

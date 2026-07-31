import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface CandidateHistoryRow {
  id: string;
  match_score: number;
  created_at: string;
  candidates: { name: string } | null;
  job_descriptions: { title: string } | null;
}

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("id, match_score, created_at, candidates(name), job_descriptions(title)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    (data ?? []).map((row: CandidateHistoryRow) => ({
      evaluationId: row.id,
      candidateName: row.candidates?.name ?? "Unknown",
      jobTitle: row.job_descriptions?.title ?? "Unknown",
      matchScore: row.match_score,
      createdAt: row.created_at,
    }))
  );
}

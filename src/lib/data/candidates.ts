import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface CandidateHistoryItem {
  evaluationId: string;
  candidateName: string;
  jobTitle: string;
  matchScore: number;
  createdAt: string;
}

interface CandidateHistoryRow {
  id: string;
  match_score: number;
  created_at: string;
  candidates: { name: string } | null;
  job_descriptions: { title: string } | null;
}

export async function listCandidateHistory(limit = 50): Promise<CandidateHistoryItem[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("id, match_score, created_at, candidates(name), job_descriptions(title)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: CandidateHistoryRow) => ({
    evaluationId: row.id,
    candidateName: row.candidates?.name ?? "Unknown",
    jobTitle: row.job_descriptions?.title ?? "Unknown",
    matchScore: row.match_score,
    createdAt: row.created_at,
  }));
}

import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface EvaluationDetail {
  id: string;
  candidateName: string;
  jobTitle: string;
  jobDescriptionText: string;
  matchScore: number;
  scoreRationale: string;
  missingSkills: string[];
  interviewQuestions: string[];
  parsedProfile: Record<string, unknown> | null;
  createdAt: string;
}

interface EvaluationRow {
  id: string;
  match_score: number;
  score_rationale: string;
  missing_skills: string[];
  interview_questions: string[];
  created_at: string;
  candidates: { name: string; parsed_profile: Record<string, unknown> | null } | null;
  job_descriptions: { title: string; raw_text: string } | null;
}

export async function getEvaluationDetail(id: string): Promise<EvaluationDetail | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("*, candidates(name, parsed_profile), job_descriptions(title, raw_text)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as EvaluationRow;
  return {
    id: row.id,
    candidateName: row.candidates?.name ?? "Unknown",
    jobTitle: row.job_descriptions?.title ?? "Unknown",
    jobDescriptionText: row.job_descriptions?.raw_text ?? "",
    matchScore: row.match_score,
    scoreRationale: row.score_rationale,
    missingSkills: row.missing_skills ?? [],
    interviewQuestions: row.interview_questions ?? [],
    parsedProfile: row.candidates?.parsed_profile ?? null,
    createdAt: row.created_at,
  };
}

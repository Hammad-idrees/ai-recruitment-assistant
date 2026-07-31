import { tool } from "langchain";
import * as z from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Flat schema, not a discriminated union: Gemini's function-calling schema
// doesn't support JSON Schema's oneOf/const, which z.discriminatedUnion emits.
const SaveInputSchema = z.object({
  table: z.enum(["candidate", "job_description", "evaluation", "chat_message"]),
  name: z.string().optional().describe("candidate only: full name"),
  resumeStoragePath: z.string().optional().describe("candidate only: storage path of the resume file"),
  parsedProfileJson: z.string().optional().describe("candidate only: JSON string of the parsed profile object"),
  title: z.string().optional().describe("job_description only: job title"),
  rawText: z.string().optional().describe("job_description only: full raw JD text"),
  extractedRequirementsJson: z
    .string()
    .optional()
    .describe("job_description only: JSON string of the extracted requirements object"),
  candidateId: z.string().optional().describe("evaluation only"),
  jobId: z.string().optional().describe("evaluation only"),
  matchScore: z.number().optional().describe("evaluation only"),
  scoreRationale: z.string().optional().describe("evaluation only"),
  missingSkills: z.array(z.string()).optional().describe("evaluation only"),
  interviewQuestions: z.array(z.string()).optional().describe("evaluation only"),
  evaluationId: z.string().optional().describe("chat_message only"),
  role: z.enum(["user", "assistant"]).optional().describe("chat_message only"),
  content: z.string().optional().describe("chat_message only"),
});

function requireField<T>(value: T | undefined, field: string, table: string): T {
  if (value === undefined || value === null) {
    throw new Error(`db_save: missing required field "${field}" for table "${table}"`);
  }
  return value;
}

function parseJsonField(value: string | undefined, field: string, table: string): Record<string, unknown> {
  const raw = requireField(value, field, table);
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`db_save: field "${field}" for table "${table}" was not valid JSON`);
  }
}

export function createDbSaveTool() {
  return tool(
    async (input: z.infer<typeof SaveInputSchema>) => {
      const supabase = getSupabaseServerClient();

      if (input.table === "candidate") {
        const { data, error } = await supabase
          .from("candidates")
          .insert({
            name: requireField(input.name, "name", "candidate"),
            resume_storage_path: requireField(input.resumeStoragePath, "resumeStoragePath", "candidate"),
            parsed_profile: parseJsonField(input.parsedProfileJson, "parsedProfileJson", "candidate"),
          })
          .select("id")
          .single();
        if (error) throw new Error(`db_save candidate failed: ${error.message}`);
        return JSON.stringify({ table: "candidate", id: data.id });
      }

      if (input.table === "job_description") {
        const { data, error } = await supabase
          .from("job_descriptions")
          .insert({
            title: requireField(input.title, "title", "job_description"),
            raw_text: requireField(input.rawText, "rawText", "job_description"),
            extracted_requirements: parseJsonField(
              input.extractedRequirementsJson,
              "extractedRequirementsJson",
              "job_description"
            ),
          })
          .select("id")
          .single();
        if (error) throw new Error(`db_save job_description failed: ${error.message}`);
        return JSON.stringify({ table: "job_description", id: data.id });
      }

      if (input.table === "evaluation") {
        const { data, error } = await supabase
          .from("evaluations")
          .insert({
            candidate_id: requireField(input.candidateId, "candidateId", "evaluation"),
            job_id: requireField(input.jobId, "jobId", "evaluation"),
            match_score: requireField(input.matchScore, "matchScore", "evaluation"),
            score_rationale: requireField(input.scoreRationale, "scoreRationale", "evaluation"),
            missing_skills: input.missingSkills ?? [],
            interview_questions: input.interviewQuestions ?? [],
          })
          .select("id")
          .single();
        if (error) throw new Error(`db_save evaluation failed: ${error.message}`);
        return JSON.stringify({ table: "evaluation", id: data.id });
      }

      // chat_message
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          evaluation_id: requireField(input.evaluationId, "evaluationId", "chat_message"),
          role: requireField(input.role, "role", "chat_message"),
          content: requireField(input.content, "content", "chat_message"),
        })
        .select("id")
        .single();
      if (error) throw new Error(`db_save chat_message failed: ${error.message}`);
      return JSON.stringify({ table: "chat_message", id: data.id });
    },
    {
      name: "db_save",
      description:
        "Persists a record to Supabase. table must be one of: candidate, job_description, evaluation, chat_message. Only fields relevant to the chosen table are required — see each field's description. Save the candidate and job_description first (to get their ids), then the evaluation.",
      schema: SaveInputSchema,
    }
  );
}

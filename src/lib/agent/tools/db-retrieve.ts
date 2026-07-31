import { tool } from "langchain";
import * as z from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Flat schema, not a discriminated union: Gemini's function-calling schema
// doesn't support JSON Schema's oneOf/const, which z.discriminatedUnion emits.
const RetrieveInputSchema = z.object({
  query: z.enum(["candidate_history", "evaluation_detail", "chat_history"]),
  limit: z.number().optional().describe("candidate_history only: max rows, default 20"),
  evaluationId: z.string().optional().describe("required for evaluation_detail and chat_history"),
});

function requireEvaluationId(value: string | undefined, query: string): string {
  if (!value) throw new Error(`db_retrieve: evaluationId is required for query "${query}"`);
  return value;
}

export function createDbRetrieveTool() {
  return tool(
    async (input: z.infer<typeof RetrieveInputSchema>) => {
      const supabase = getSupabaseServerClient();

      if (input.query === "candidate_history") {
        const { data, error } = await supabase
          .from("evaluations")
          .select("id, match_score, created_at, candidates(name), job_descriptions(title)")
          .order("created_at", { ascending: false })
          .limit(input.limit ?? 20);
        if (error) throw new Error(`db_retrieve candidate_history failed: ${error.message}`);
        return JSON.stringify(data);
      }

      if (input.query === "evaluation_detail") {
        const evaluationId = requireEvaluationId(input.evaluationId, "evaluation_detail");
        const { data, error } = await supabase
          .from("evaluations")
          .select("*, candidates(name, parsed_profile), job_descriptions(title, raw_text)")
          .eq("id", evaluationId)
          .single();
        if (error) throw new Error(`db_retrieve evaluation_detail failed: ${error.message}`);
        return JSON.stringify(data);
      }

      // chat_history
      const evaluationId = requireEvaluationId(input.evaluationId, "chat_history");
      const { data, error } = await supabase
        .from("chat_messages")
        .select("role, content, created_at")
        .eq("evaluation_id", evaluationId)
        .order("created_at", { ascending: true });
      if (error) throw new Error(`db_retrieve chat_history failed: ${error.message}`);
      return JSON.stringify(data);
    },
    {
      name: "db_retrieve",
      description:
        "Reads records from Supabase. query must be one of: candidate_history (list past evaluations), evaluation_detail (one full evaluation, requires evaluationId), chat_history (past chat messages for an evaluation, requires evaluationId).",
      schema: RetrieveInputSchema,
    }
  );
}

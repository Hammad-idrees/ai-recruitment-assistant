import { NextResponse } from "next/server";
import { createRecruitingAgent } from "@/lib/agent";
import { getFinalReplyText } from "@/lib/agent/extract-tool-result";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const evaluationId = searchParams.get("evaluationId");

  if (!evaluationId) {
    return NextResponse.json({ error: "evaluationId query param is required." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("evaluation_id", evaluationId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

interface ChatRequestBody {
  evaluationId?: unknown;
  message?: unknown;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { evaluationId, message } = body;

  if (typeof evaluationId !== "string" || evaluationId.trim().length === 0) {
    return NextResponse.json({ error: "evaluationId is required." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  const { data: evaluation, error: evalError } = await supabase
    .from("evaluations")
    .select("id")
    .eq("id", evaluationId)
    .maybeSingle();

  if (evalError) {
    return NextResponse.json({ error: evalError.message }, { status: 500 });
  }
  if (!evaluation) {
    return NextResponse.json({ error: "Evaluation not found." }, { status: 404 });
  }

  // Vercel functions are stateless between requests, so the full prior
  // conversation is reloaded from Supabase on every call, not kept in memory.
  const { data: priorMessages, error: historyError } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("evaluation_id", evaluationId)
    .order("created_at", { ascending: true });

  if (historyError) {
    return NextResponse.json({ error: historyError.message }, { status: 500 });
  }

  const contextMessage = {
    role: "user" as const,
    content: `Context: this is a follow-up conversation about evaluation_id=${evaluationId}. Use db_retrieve (evaluation_detail or chat_history) if you need the saved score, skills, or interview questions. Do not re-run parse_resume, match_job, calculate_ats_score, or generate_interview_questions in this conversation.`,
  };

  const conversation = [
    contextMessage,
    ...(priorMessages ?? []).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  const agent = createRecruitingAgent();
  let result: Awaited<ReturnType<typeof agent.invoke>>;
  try {
    result = await agent.invoke({ messages: conversation });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent invocation failed." },
      { status: 502 }
    );
  }

  const reply = getFinalReplyText(result.messages);

  // Persisted directly here rather than via the agent's db_save tool: this is
  // deterministic bookkeeping, not reasoning, and every extra tool call costs
  // quota under this project's tight Gemini rate limits.
  const { error: insertError } = await supabase.from("chat_messages").insert([
    { evaluation_id: evaluationId, role: "user", content: message },
    { evaluation_id: evaluationId, role: "assistant", content: reply },
  ]);

  if (insertError) {
    return NextResponse.json(
      { error: `Reply generated but failed to save: ${insertError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ reply });
}

import { NextResponse } from "next/server";
import { createRecruitingAgent } from "@/lib/agent";
import { getSavedRecordId, getFinalReplyText } from "@/lib/agent/extract-tool-result";
import { getEvaluationDetail } from "@/lib/data/evaluations";

export const runtime = "nodejs";
export const maxDuration = 120;

interface EvaluateRequestBody {
  resumeText?: unknown;
  resumeStoragePath?: unknown;
  jobDescriptionText?: unknown;
  jobTitle?: unknown;
}

function validate(body: EvaluateRequestBody): string[] {
  const errors: string[] = [];
  if (typeof body.resumeText !== "string" || body.resumeText.trim().length < 30) {
    errors.push("resumeText is required (min 30 characters).");
  }
  if (typeof body.resumeStoragePath !== "string" || body.resumeStoragePath.trim().length === 0) {
    errors.push("resumeStoragePath is required.");
  }
  if (typeof body.jobDescriptionText !== "string" || body.jobDescriptionText.trim().length < 20) {
    errors.push("jobDescriptionText is required (min 20 characters).");
  }
  if (typeof body.jobTitle !== "string" || body.jobTitle.trim().length === 0) {
    errors.push("jobTitle is required.");
  }
  return errors;
}

export async function POST(request: Request) {
  let body: EvaluateRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const { resumeText, resumeStoragePath, jobDescriptionText, jobTitle } = body as Required<EvaluateRequestBody>;

  const userMessage = `Evaluate this candidate for the role.

job_title: ${jobTitle}
resume_storage_path: ${resumeStoragePath}

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescriptionText}
"""`;

  const agent = createRecruitingAgent();
  let result: Awaited<ReturnType<typeof agent.invoke>>;
  try {
    result = await agent.invoke({ messages: [{ role: "user", content: userMessage }] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent invocation failed." },
      { status: 502 }
    );
  }

  const evaluationId = getSavedRecordId(result.messages, "evaluation");
  if (!evaluationId) {
    return NextResponse.json(
      {
        error: "The agent did not save an evaluation.",
        agentSummary: getFinalReplyText(result.messages),
      },
      { status: 502 }
    );
  }

  // The agent's tool calls are the source of structured truth; read the
  // persisted row back rather than parsing the agent's prose reply.
  let detail;
  try {
    detail = await getEvaluationDetail(evaluationId);
  } catch (err) {
    return NextResponse.json(
      { error: `Saved but failed to read back: ${err instanceof Error ? err.message : "unknown error"}` },
      { status: 500 }
    );
  }
  if (!detail) {
    return NextResponse.json({ error: "Saved but the evaluation was not found." }, { status: 500 });
  }

  return NextResponse.json({
    evaluationId: detail.id,
    candidateName: detail.candidateName,
    jobTitle: detail.jobTitle,
    matchScore: detail.matchScore,
    scoreRationale: detail.scoreRationale,
    missingSkills: detail.missingSkills,
    interviewQuestions: detail.interviewQuestions,
    agentSummary: getFinalReplyText(result.messages),
  });
}

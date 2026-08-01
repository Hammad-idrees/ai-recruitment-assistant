import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEvaluationDetail } from "@/lib/data/evaluations";
import { ScoreMeter } from "@/components/candidates/score-meter";
import { MissingSkillsCard } from "@/components/candidates/missing-skills-card";
import { InterviewQuestionsList } from "@/components/candidates/interview-questions-list";
import { ChatPanel } from "@/components/candidates/chat-panel";
import { GlowBackground } from "@/components/layout/glow-background";

export const dynamic = "force-dynamic";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evaluation = await getEvaluationDetail(id);

  if (!evaluation) notFound();

  return (
    <div className="relative w-full pb-20">
      <GlowBackground />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-16">
        <Link
          href="/candidates"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          History
        </Link>

        <div className="mb-8 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{evaluation.candidateName}</h1>
          <p className="text-sm text-muted-foreground">{evaluation.jobTitle}</p>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <ScoreMeter score={evaluation.matchScore} className="shrink-0" />
            <div className="w-full sm:pt-2">
              <h2 className="mb-2 text-sm font-medium">Score rationale</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {evaluation.scoreRationale}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-sm font-medium">Skills gap</h2>
            <MissingSkillsCard skills={evaluation.missingSkills} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-sm font-medium">Interview questions</h2>
            <InterviewQuestionsList questions={evaluation.interviewQuestions} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-sm font-medium">Ask about this candidate</h2>
          <div className="h-105">
            <ChatPanel evaluationId={evaluation.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Briefcase } from "lucide-react";
import { getEvaluationDetail } from "@/lib/data/evaluations";
import { ScoreMeter } from "@/components/candidates/score-meter";
import { MissingSkillsCard } from "@/components/candidates/missing-skills-card";
import { InterviewQuestionsList } from "@/components/candidates/interview-questions-list";
import { ChatPanel } from "@/components/candidates/chat-panel";
import { Button } from "@/components/ui/button";

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
    <div className="relative w-full pb-32">
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-24 lg:pt-32">
        <div className="mb-8">
          <Button
            render={<Link href="/candidates" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
            Back to History
          </Button>
        </div>

        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-glow-amber/20 to-glow-blue/20 border border-white/10">
              <User className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{evaluation.candidateName}</h1>
              <div className="flex items-center gap-2 mt-1 text-white/60">
                <Briefcase className="size-4" />
                <p className="text-base">{evaluation.jobTitle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-1 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
          <div className="rounded-2xl bg-black/20 p-8">
            <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start">
              <ScoreMeter score={evaluation.matchScore} className="shrink-0" />
              <div className="w-full sm:pt-3">
                <h2 className="mb-3 text-lg font-semibold text-white">Score rationale</h2>
                <p className="text-base leading-relaxed text-white/70">
                  {evaluation.scoreRationale}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-1 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
            <div className="rounded-2xl bg-black/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-glow-amber/20 to-glow-blue/20">
                  <span className="text-lg">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-white">Skills gap analysis</h2>
              </div>
              <MissingSkillsCard skills={evaluation.missingSkills} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-1 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
            <div className="rounded-2xl bg-black/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-glow-amber/20 to-glow-blue/20">
                  <span className="text-lg">💡</span>
                </div>
                <h2 className="text-xl font-bold text-white">Interview questions</h2>
              </div>
              <InterviewQuestionsList questions={evaluation.interviewQuestions} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-1 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
          <div className="rounded-2xl bg-black/20 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Ask about this candidate</h2>
            <div className="h-105">
              <ChatPanel evaluationId={evaluation.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

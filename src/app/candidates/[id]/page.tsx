import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEvaluationDetail } from "@/lib/data/evaluations";
import { ScoreMeter } from "@/components/score-meter";
import { MissingSkillsCard } from "@/components/missing-skills-card";
import { InterviewQuestionsList } from "@/components/interview-questions-list";
import { ChatPanel } from "@/components/chat-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
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

      <Card className="mb-6">
        <CardContent className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <ScoreMeter score={evaluation.matchScore} className="shrink-0" />
          <div className="w-full sm:pt-2">
            <h2 className="mb-2 text-sm font-medium">Score rationale</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {evaluation.scoreRationale}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Skills gap</CardTitle>
          </CardHeader>
          <CardContent>
            <MissingSkillsCard skills={evaluation.missingSkills} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Interview questions</CardTitle>
          </CardHeader>
          <CardContent>
            <InterviewQuestionsList questions={evaluation.interviewQuestions} />
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-6" />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ask about this candidate</CardTitle>
        </CardHeader>
        <CardContent className="h-[420px]">
          <ChatPanel evaluationId={evaluation.id} />
        </CardContent>
      </Card>
    </div>
  );
}

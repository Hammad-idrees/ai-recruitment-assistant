import { listCandidateHistory } from "@/lib/data/candidates";
import { CandidateHistoryTable } from "@/components/candidates/candidate-history-table";
import { GlowBackground } from "@/components/layout/glow-background";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const items = await listCandidateHistory();

  return (
    <div className="relative w-full pb-20">
      <GlowBackground />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-16 lg:pt-20">
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-glow-amber" />
            Evaluations
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Candidate history</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Every evaluation the agent has run, most recent first. Click a candidate to see
            the full breakdown and chat with the assistant about them.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-2 backdrop-blur-xl">
          <CandidateHistoryTable items={items} />
        </div>
      </div>
    </div>
  );
}

import { listCandidateHistory } from "@/lib/data/candidates";
import { CandidateHistoryTable } from "@/components/candidate-history-table";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const items = await listCandidateHistory();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Candidate history</h1>
        <p className="text-sm text-muted-foreground">
          Every evaluation the agent has run, most recent first.
        </p>
      </div>
      <CandidateHistoryTable items={items} />
    </div>
  );
}

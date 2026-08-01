import { listCandidateHistory } from "@/lib/data/candidates";
import { CandidateHistoryTable } from "@/components/candidates/candidate-history-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const items = await listCandidateHistory();

  return (
    <div className="relative w-full pb-32">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 lg:pt-32">
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              variant="ghost"
              size="sm"
              className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="size-4" />
              Home
            </Button>
            <div className="inline-flex items-center gap-2 rounded-full border border-glow-amber/30 bg-gradient-to-r from-glow-amber/10 to-glow-blue/10 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_-8px_rgba(251,191,36,0.2)]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-glow-amber opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-glow-amber" />
              </span>
              Evaluations
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Candidate history</h1>
            <p className="max-w-2xl text-lg text-white/70">
              Every evaluation the agent has run, most recent first. Click a candidate to see
              the full breakdown and chat with the assistant about them.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-1 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
          <div className="rounded-2xl bg-black/20 p-6">
            <CandidateHistoryTable items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}

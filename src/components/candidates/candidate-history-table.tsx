import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/candidates/score-badge";
import type { CandidateHistoryItem } from "@/lib/data/candidates";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvaluationAction } from "@/app/actions/evaluations";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteEvaluationAction}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}

export function CandidateHistoryTable({ items }: { items: CandidateHistoryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-24 text-center backdrop-blur-xl">
        <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-white/5">
          <ArrowRight className="size-6 text-white/30" />
        </div>
        <p className="text-base font-semibold text-white">No evaluations yet</p>
        <p className="mt-2 text-sm text-white/50">
          Run your first evaluation to see it appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-sm font-semibold text-white/70">Candidate</TableHead>
            <TableHead className="text-sm font-semibold text-white/70">Role</TableHead>
            <TableHead className="text-sm font-semibold text-white/70">Score</TableHead>
            <TableHead className="text-sm font-semibold text-white/70">Date</TableHead>
            <TableHead className="text-right text-sm font-semibold text-white/70">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.evaluationId}
              className="group border-white/5 transition-all duration-300 hover:bg-white/5 hover:shadow-[0_0_30px_-12px_rgba(251,191,36,0.1)]"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/candidates/${item.evaluationId}`}
                  className="inline-flex items-center gap-2 text-white hover:text-glow-amber transition-colors duration-300"
                >
                  {item.candidateName}
                  <ArrowRight className="size-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </TableCell>
              <TableCell className="text-white/60 group-hover:text-white/80 transition-colors duration-300">{item.jobTitle}</TableCell>
              <TableCell>
                <ScoreBadge score={item.matchScore} />
              </TableCell>
              <TableCell className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                {formatDate(item.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DeleteButton id={item.evaluationId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

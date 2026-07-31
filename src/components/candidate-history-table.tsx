import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/score-badge";
import type { CandidateHistoryItem } from "@/lib/data/candidates";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CandidateHistoryTable({ items }: { items: CandidateHistoryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-20 text-center">
        <p className="text-sm font-medium">No evaluations yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Run your first evaluation to see it appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Candidate</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.evaluationId} className="group">
              <TableCell className="font-medium">
                <Link
                  href={`/candidates/${item.evaluationId}`}
                  className="underline-offset-4 group-hover:underline"
                >
                  {item.candidateName}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{item.jobTitle}</TableCell>
              <TableCell>
                <ScoreBadge score={item.matchScore} />
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDate(item.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

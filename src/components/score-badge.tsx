import { cn } from "@/lib/utils";
import { getScoreBand } from "@/lib/score-band";

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const band = getScoreBand(score);
  const Icon = band.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium tabular-nums",
        band.bg,
        band.text,
        className
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.25} />
      {Math.round(score)}
    </span>
  );
}

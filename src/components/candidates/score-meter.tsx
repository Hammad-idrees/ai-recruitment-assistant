import { cn } from "@/lib/utils";
import { getScoreBand } from "@/lib/score-band";

const SIZE = 132;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreMeter({ score, className }: { score: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  const band = getScoreBand(clamped);
  const Icon = band.icon;
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            fill="none"
            className={band.track}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={cn(band.arc, "transition-[stroke-dashoffset] duration-700 ease-out")}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[40px] font-semibold leading-none tracking-tight tabular-nums">
            {Math.round(clamped)}
          </span>
          <span className="mt-1 text-[11px] text-muted-foreground">out of 100</span>
        </div>
      </div>
      <div className={cn("flex items-center gap-1.5 text-[13px] font-medium", band.text)}>
        <Icon className="size-3.5" strokeWidth={2.25} />
        {band.label}
      </div>
    </div>
  );
}

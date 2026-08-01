import { cn } from "@/lib/utils";
import { getScoreBand } from "@/lib/score-band";

const SIZE = 152;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreMeter({ score, className }: { score: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  const band = getScoreBand(clamped);
  const Icon = band.icon;
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Glow effect behind the meter */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-glow-amber/20 to-glow-blue/20 blur-2xl opacity-50" />
        
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90 relative z-10">
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
            className={cn(band.arc, "transition-[stroke-dashoffset] duration-700 ease-out drop-shadow-lg")}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-[48px] font-bold leading-none tracking-tight tabular-nums text-white">
            {Math.round(clamped)}
          </span>
          <span className="mt-1 text-xs text-white/50">out of 100</span>
        </div>
      </div>
      <div className={cn("flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-white/5 border border-white/10", band.text)}>
        <Icon className="size-4" strokeWidth={2.25} />
        {band.label}
      </div>
    </div>
  );
}

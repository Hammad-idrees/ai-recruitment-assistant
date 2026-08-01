import { CheckCircle2, XCircle } from "lucide-react";

export function MissingSkillsCard({ skills }: { skills: string[] }) {
  if (skills.length === 0) {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-status-good/30 bg-status-good/10 p-6">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-status-good" strokeWidth={2.25} />
        <div>
          <p className="text-lg font-semibold text-white mb-1">Perfect match!</p>
          <p className="text-base text-white/70">No missing required skills — full coverage on the role&apos;s must-haves.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors duration-300">
          <XCircle className="size-6 shrink-0 text-status-critical" strokeWidth={2.25} />
          <span className="text-base font-medium text-white/90">{skill}</span>
        </div>
      ))}
    </div>
  );
}

import { CheckCircle2, XCircle } from "lucide-react";

export function MissingSkillsCard({ skills }: { skills: string[] }) {
  if (skills.length === 0) {
    return (
      <div className="flex items-start gap-3 text-status-good">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" strokeWidth={2.25} />
        <p className="text-base text-white/70">No missing required skills — full coverage on the role&apos;s must-haves.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {skills.map((skill) => (
        <li key={skill} className="flex items-center gap-3 text-base text-white/80">
          <XCircle className="size-5 shrink-0 text-status-critical" strokeWidth={2.25} />
          {skill}
        </li>
      ))}
    </ul>
  );
}

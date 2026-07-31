import { CheckCircle2, XCircle } from "lucide-react";

export function MissingSkillsCard({ skills }: { skills: string[] }) {
  if (skills.length === 0) {
    return (
      <div className="flex items-start gap-2.5 text-status-good">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
        <p className="text-sm">No missing required skills — full coverage on the role&apos;s must-haves.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {skills.map((skill) => (
        <li key={skill} className="flex items-center gap-2.5 text-sm">
          <XCircle className="size-4 shrink-0 text-status-critical" strokeWidth={2.25} />
          {skill}
        </li>
      ))}
    </ul>
  );
}

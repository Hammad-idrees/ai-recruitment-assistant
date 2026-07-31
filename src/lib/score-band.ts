import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export type ScoreBandKey = "good" | "warning" | "critical";

export interface ScoreBand {
  key: ScoreBandKey;
  label: string;
  icon: typeof CheckCircle2;
  text: string;
  bg: string;
  track: string;
  arc: string;
}

export const SCORE_BANDS: Record<ScoreBandKey, ScoreBand> = {
  good: {
    key: "good",
    label: "Strong match",
    icon: CheckCircle2,
    text: "text-status-good",
    bg: "bg-status-good/10",
    track: "stroke-status-good/15",
    arc: "stroke-status-good",
  },
  warning: {
    key: "warning",
    label: "Moderate match",
    icon: AlertTriangle,
    text: "text-status-warning",
    bg: "bg-status-warning/10",
    track: "stroke-status-warning/15",
    arc: "stroke-status-warning",
  },
  critical: {
    key: "critical",
    label: "Weak match",
    icon: XCircle,
    text: "text-status-critical",
    bg: "bg-status-critical/10",
    track: "stroke-status-critical/15",
    arc: "stroke-status-critical",
  },
};

export function getScoreBand(score: number): ScoreBand {
  if (score >= 75) return SCORE_BANDS.good;
  if (score >= 50) return SCORE_BANDS.warning;
  return SCORE_BANDS.critical;
}

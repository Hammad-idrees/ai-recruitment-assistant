import Link from "next/link";
import { ArrowLeft, MessageSquareText, Target, XCircle } from "lucide-react";
import { EvaluateForm } from "@/components/evaluate/evaluate-form";
import { GlowBackground } from "@/components/layout/glow-background";
import { Button } from "@/components/ui/button";

const OUTCOMES = [
  {
    icon: Target,
    title: "Transparent ATS score",
    description: "A 0-100 match score with a plain-language rationale behind the number.",
  },
  {
    icon: XCircle,
    title: "Skills gap analysis",
    description: "Exactly which required skills are missing, so you know what to probe.",
  },
  {
    icon: MessageSquareText,
    title: "Interview questions",
    description: "Five questions tailored to this candidate's strengths and gaps.",
  },
];

export default function EvaluatePage() {
  return (
    <div className="relative w-full pb-24">
      <GlowBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16">
        <div className="mb-8">
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
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div>
            <div className="mb-8 space-y-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Evaluate a candidate
              </h1>
              <p className="text-base text-white/70">
                Upload a resume and paste a job description — the agent takes it from
                there.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-1 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
              <div className="rounded-2xl bg-black/20 p-8 sm:p-10">
                <EvaluateForm />
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <p className="px-1 text-sm font-semibold text-white/60">What you&apos;ll get</p>
              {OUTCOMES.map((outcome) => (
                <div
                  key={outcome.title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-1 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
                >
                  <div className="rounded-xl bg-black/20 p-5">
                    <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5">
                      <outcome.icon className="size-5 text-glow-amber" />
                    </span>
                    <h3 className="mb-1 text-base font-semibold text-white">{outcome.title}</h3>
                    <p className="text-sm leading-relaxed text-white/60">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  MessageSquareText,
  Sparkles,
  Target,
} from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import headsetGirl from "../../public/headset_girl.png";
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaServer, 
  FaGithub,
  FaAws,
  FaDocker,
  FaGitAlt
} from "react-icons/fa";
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiVercel,
  SiSupabase,
  SiLangchain,
  SiShadcnui
} from "react-icons/si";

const ACCENTS = {
  amber: {
    border: "hover:border-glow-amber/40",
    shadow: "hover:shadow-glow-amber/10",
    glow: "from-glow-amber/5",
    iconBgHover: "group-hover:bg-glow-amber/15",
    iconTextHover: "group-hover:text-glow-amber",
    titleHover: "group-hover:text-glow-amber",
    line: "via-glow-amber/50",
  },
  blue: {
    border: "hover:border-glow-blue/40",
    shadow: "hover:shadow-glow-blue/10",
    glow: "from-glow-blue/5",
    iconBgHover: "group-hover:bg-glow-blue/15",
    iconTextHover: "group-hover:text-glow-blue",
    titleHover: "group-hover:text-glow-blue",
    line: "via-glow-blue/50",
  },
} as const;

const technologies = [
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "shadcn/ui", icon: SiShadcnui, color: "text-zinc-400" },
  { name: "Supabase", icon: SiSupabase, color: "text-emerald-400" },
  { name: "LangGraph", icon: SiLangchain, color: "text-purple-400" },
  { name: "React", icon: FaReact, color: "text-cyan-400" },
  { name: "Vercel", icon: SiVercel, color: "text-white" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "Docker", icon: FaDocker, color: "text-blue-400" },
  { name: "Git", icon: FaGitAlt, color: "text-orange-500" },
  { name: "GitHub", icon: FaGithub, color: "text-white" },
];

const STEPS = [
  {
    icon: FileSearch,
    title: "Upload & parse",
    description:
      "Drop a resume and paste the job description. The agent extracts skills, experience, and requirements.",
    accent: "amber" as const,
  },
  {
    icon: Target,
    title: "Match & score",
    description:
      "Deterministic matching against the role, with a transparent 0-100 ATS score and rationale.",
    accent: "blue" as const,
  },
  {
    icon: MessageSquareText,
    title: "Prep the interview",
    description:
      "Tailored interview questions targeting gaps, plus a chat to dig deeper into any candidate.",
    accent: "amber" as const,
  },
];

const STATS = [
  { value: "6", label: "Custom agent tools" },
  { value: "0-100", label: "Transparent ATS scoring" },
  { value: "<60s", label: "Typical evaluation time" },
];

export default function Home() {
  return (
    <div className="relative w-full">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16 pb-20 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Left column: headline + CTA */}
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-glow-amber/30 bg-gradient-to-r from-glow-amber/10 to-glow-blue/10 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_-8px_rgba(251,191,36,0.2)]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-glow-amber opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-glow-amber" />
              </span>
              Powered by a LangGraph deep agent
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Hire smarter,{" "}
              <span className="bg-gradient-to-r from-glow-amber via-glow-blue to-glow-amber bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                not harder.
              </span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-white/70">
              Simply upload a resume and job description. Our AI handles the rest,
              extracting skills, matching requirements, calculating fit scores, and
              generating tailored interview questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                render={<Link href="/evaluate" />}
                nativeButton={false}
                size="lg"
                className="group gap-2 rounded-xl bg-gradient-to-r from-glow-amber to-glow-blue text-black font-semibold shadow-[0_0_40px_-12px_rgba(251,191,36,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_-12px_rgba(251,191,36,0.4)]"
              >
                Start an evaluation
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                render={<Link href="/candidates" />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 text-white font-semibold backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/30"
              >
                View history
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="group">
                  <p className="text-3xl font-bold tracking-tight tabular-nums text-white group-hover:text-glow-amber transition-colors duration-300">
                    {stat.value}
                  </p>
                  <p className="text-xs leading-snug text-white/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: hero visual */}
          <div className="animate-in fade-in slide-in-from-bottom-4 relative hidden delay-150 duration-700 lg:block">
            <div className="relative scale-110 xl:scale-125 origin-center translate-x-4">
              {/* Enhanced glow halo behind the image */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-glow-amber/30 via-glow-blue/25 to-glow-amber/20 blur-[100px] animate-pulse" />
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-t from-glow-blue/20 to-transparent blur-[60px]" />

              <div className="relative aspect-4/3">
                <Image
                  src={headsetGirl}
                  alt=""
                  fill
                  priority
                  className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 50vw, 0px"
                />
              </div>

              {/* Enhanced floating glass cards */}
              <div className="absolute top-4 -left-6 flex items-center gap-2.5 rounded-2xl border border-glow-amber/30 bg-gradient-to-br from-white/10 to-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(251,191,36,0.2)] xl:-left-10 transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_-8px_rgba(251,191,36,0.3)]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-good opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-status-good" />
                </span>
                Agent active
              </div>

              <div className="absolute bottom-8 -right-4 rounded-2xl border border-glow-blue/30 bg-gradient-to-br from-white/10 to-white/5 px-5 py-4 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(59,130,246,0.2)] xl:-right-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_-8px_rgba(59,130,246,0.3)]">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <Sparkles className="size-3.5 text-glow-amber" />
                  ATS match
                </div>
                <p className="mt-1 text-2xl font-bold tabular-nums text-white">92</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology marquee */}
        <div className="mt-12 space-y-3">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Built with modern technologies</h2>
          </div>
          <div className="relative w-full overflow-hidden border-y border-white/10 bg-gradient-to-r from-white/5 via-white/[0.02] to-white/5 py-4 backdrop-blur-2xl">
            <Marquee pauseOnHover className="[--duration:25s]">
              {technologies.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="flex items-center gap-3 mx-8 px-5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <Icon className={`text-xl ${tech.color} group-hover:opacity-100 opacity-80 transition-all duration-300`} />
                    <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors duration-300">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background to-transparent" />
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">How it works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const accent = ACCENTS[step.accent];
            return (
              <div
                key={step.title}
                className={cn(
                  "group animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/6 to-white/[0.015] p-8 backdrop-blur-xl duration-700 [animation-fill-mode:both] hover:-translate-y-1 hover:shadow-2xl",
                  accent.border,
                  accent.shadow
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Huge background numeral */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-6 -right-3 text-[8rem] leading-none font-bold tabular-nums text-white/[0.04] transition-colors duration-700 select-none group-hover:text-white/[0.06]"
                >
                  0{i + 1}
                </span>

                {/* Decorative gradient glow */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100",
                    accent.glow
                  )}
                />

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />

                <div className="relative">
                  <span
                    className={cn(
                      "relative mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/5 shadow-lg ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:scale-110",
                      accent.iconBgHover
                    )}
                  >
                    <step.icon
                      className={cn(
                        "relative size-6 text-muted-foreground transition-colors duration-500",
                        accent.iconTextHover
                      )}
                      strokeWidth={2}
                    />
                  </span>
                  <h3
                    className={cn(
                      "mb-3 text-base font-semibold tracking-tight text-white transition-colors duration-300",
                      accent.titleHover
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/75">
                    {step.description}
                  </p>
                </div>

                {/* Hover accent line */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100",
                    accent.line
                  )}
                />
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { EvaluateForm } from "@/components/evaluate/evaluate-form";
import { Marquee } from "@/components/ui/marquee";
import { GlowBackground } from "@/components/layout/glow-background";
import headsetGirl from "../../public/headset_girl.png";

const companies = [
  "Innovate HR",
  "TechCorp",
  "Enterprise Solutions",
  "NextGen Startups",
  "Global Logistics",
  "Acme Tech",
  "Cloud Systems",
];

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden">
      <GlowBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16 pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Left column: headline + form */}
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-glow-amber" />
                Powered by a LangGraph deep agent
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Hire smarter,{" "}
                <span className="bg-linear-to-r from-glow-amber to-glow-blue bg-clip-text text-transparent">
                  not harder.
                </span>
              </h1>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                Upload a resume and job description. The agent parses the resume, matches
                it against the role, scores the fit, and drafts interview questions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl sm:p-8">
              <EvaluateForm />
            </div>
          </div>

          {/* Right column: hero visual */}
          <div className="relative hidden lg:block scale-110 xl:scale-125 origin-center translate-x-4">
            <div className="relative aspect-4/3">
              <Image
                src={headsetGirl}
                alt=""
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(min-width: 1024px) 50vw, 0px"
              />
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-4">
          <p className="text-center text-xs font-medium text-muted-foreground">
            Trusted by recruiting teams at
          </p>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/3 py-4 backdrop-blur-xl">
            <Marquee pauseOnHover className="[--duration:25s]">
              {companies.map((company) => (
                <span key={company} className="mx-6 text-sm font-medium text-muted-foreground">
                  {company}
                </span>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

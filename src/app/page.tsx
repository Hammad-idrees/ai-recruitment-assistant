import { EvaluateForm } from "@/components/evaluate-form";
import { Marquee } from "@/components/ui/marquee";

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
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* Left Column: Hero Copy */}
          <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                ✨ Powered by Deep Agents
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Hire smarter, <br />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-1">not harder.</span>
              </h1>
              <p className="max-w-[480px] text-lg text-muted-foreground">
                Upload a resume and job description. Our AI agent instantly evaluates the fit, highlights missing skills, and drafts tailored interview questions.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              <p className="text-sm font-medium text-muted-foreground">
                Trusted by recruiting teams at
              </p>
              <div className="relative flex w-full max-w-[480px] flex-col items-center justify-center overflow-hidden rounded-lg bg-background/50 border border-border/50 py-4 shadow-sm backdrop-blur">
                <Marquee pauseOnHover className="[--duration:20s]">
                  {companies.map((company) => (
                    <span key={company} className="mx-4 text-sm font-semibold text-foreground/70">
                      {company}
                    </span>
                  ))}
                </Marquee>
                {/* Gradient Fades for Marquee */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background dark:from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background dark:from-background"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="relative flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <div className="w-full max-w-lg rounded-2xl border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
              <div className="mb-6 space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Evaluate Candidate</h2>
                <p className="text-sm text-muted-foreground">
                  Let the agent do the heavy lifting
                </p>
              </div>
              <EvaluateForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

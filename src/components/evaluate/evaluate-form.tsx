"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeDropzone } from "@/components/evaluate/resume-dropzone";
import { cn } from "@/lib/utils";

const STEPS = [
  "Parsing resume",
  "Matching job requirements",
  "Calculating ATS score",
  "Drafting interview questions",
];

const MIN_JD_LENGTH = 0;

function FieldNumber({ n, done }: { n: number; done: boolean }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums transition-colors",
        done ? "bg-status-good/20 text-status-good" : "bg-white/10 text-white/60"
      )}
    >
      {done ? <CheckCircle2 className="size-3.5" /> : n}
    </span>
  );
}

export function EvaluateForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jdLength = jobDescription.trim().length;
  const jdValid = jdLength >= MIN_JD_LENGTH;
  const titleValid = jobTitle.trim().length > 0;
  const canSubmit = !!file && titleValid && jdValid && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload-resume", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Failed to upload resume.");

      const evaluateRes = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: uploadData.resumeText,
          resumeStoragePath: uploadData.resumeStoragePath,
          jobDescriptionText: jobDescription,
          jobTitle,
        }),
      });
      const evaluateData = await evaluateRes.json();
      if (!evaluateRes.ok) throw new Error(evaluateData.error ?? "Evaluation failed.");

      router.push(`/candidates/${evaluateData.evaluationId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-white/10 bg-white/3 px-8 py-16 text-center backdrop-blur-xl">
        <div className="loader">
          <span></span>
        </div>
        <div className="space-y-2">
          <p className="text-base font-semibold text-white">Running the evaluation</p>
          <p className="text-sm text-white/60">
            This can take up to a minute — the agent works through each step in order.
          </p>
        </div>
        <ol className="space-y-2 text-sm text-white/50">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-white/10 text-xs">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="resume-file-input" className="flex items-center gap-2 text-sm font-semibold text-white">
          <FieldNumber n={1} done={!!file} />
          Resume
        </Label>
        <ResumeDropzone file={file} onChange={setFile} disabled={isSubmitting} />
      </div>

      <div className="space-y-3">
        <Label htmlFor="job-title" className="flex items-center gap-2 text-sm font-semibold text-white">
          <FieldNumber n={2} done={titleValid} />
          Job title
        </Label>
        <div className="relative">
          <Briefcase className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="job-title"
            placeholder="e.g. Jr. Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={isSubmitting}
            className="bg-white/5 border-white/10 h-12 pl-11 text-base focus-visible:ring-glow-amber/40 focus-visible:border-glow-amber/40"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="job-description" className="flex items-center gap-2 text-sm font-semibold text-white">
            <FieldNumber n={3} done={jdValid} />
            Job description
          </Label>
          <span
            className={cn(
              "text-sm tabular-nums font-medium",
              jdValid ? "text-status-good" : "text-muted-foreground"
            )}
          >
            {jdLength}/{MIN_JD_LENGTH}
          </span>
        </div>
        <Textarea
          id="job-description"
          placeholder="Paste the full job description, including required and nice-to-have skills..."
          className="min-h-48 resize-y bg-white/5 border-white/10 text-base focus-visible:ring-glow-amber/40 focus-visible:border-glow-amber/40"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 h-14 text-base font-semibold shadow-[0_0_0_0_oklch(0.75_0.17_55/0%)] transition-all hover:scale-[1.01] hover:shadow-[0_0_28px_2px_oklch(0.75_0.17_55/20%)] active:scale-[0.99]"
        disabled={!canSubmit}
      >
        <Sparkles className="size-5" />
        Run evaluation
      </Button>
    </form>
  );
}

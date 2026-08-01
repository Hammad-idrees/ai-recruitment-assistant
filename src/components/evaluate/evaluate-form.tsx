"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeDropzone } from "@/components/evaluate/resume-dropzone";

const STEPS = [
  "Parsing resume",
  "Matching job requirements",
  "Calculating ATS score",
  "Drafting interview questions",
];

export function EvaluateForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    !!file && jobTitle.trim().length > 0 && jobDescription.trim().length >= 20 && !isSubmitting;

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
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/3 px-8 py-16 text-center backdrop-blur-xl">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Running the evaluation</p>
          <p className="text-xs text-muted-foreground">
            This can take up to a minute — the agent works through each step in order.
          </p>
        </div>
        <ol className="space-y-1.5 text-xs text-muted-foreground">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="resume-file-input">Resume</Label>
        <ResumeDropzone file={file} onChange={setFile} disabled={isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-title">Job title</Label>
        <Input
          id="job-title"
          placeholder="e.g. Jr. Software Engineer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={isSubmitting}
          className="bg-white/5 border-white/10 focus-visible:ring-glow-amber/40 focus-visible:border-glow-amber/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description">Job description</Label>
        <Textarea
          id="job-description"
          placeholder="Paste the full job description, including required and nice-to-have skills..."
          className="min-h-40 resize-y bg-white/5 border-white/10 focus-visible:ring-glow-amber/40 focus-visible:border-glow-amber/40"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        disabled={!canSubmit}
      >
        <Sparkles className="size-4" />
        Run evaluation
      </Button>
    </form>
  );
}

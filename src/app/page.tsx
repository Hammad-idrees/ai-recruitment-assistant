import { EvaluateForm } from "@/components/evaluate-form";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-xl px-6 py-16">
      <div className="mb-10 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Evaluate a candidate</h1>
        <p className="text-sm text-muted-foreground">
          Upload a resume and paste a job description. The agent parses the resume,
          matches it against the role, scores the fit, and drafts interview questions.
        </p>
      </div>
      <EvaluateForm />
    </div>
  );
}

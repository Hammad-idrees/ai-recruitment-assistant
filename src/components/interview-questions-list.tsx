export function InterviewQuestionsList({ questions }: { questions: string[] }) {
  if (questions.length === 0) {
    return <p className="text-sm text-muted-foreground">No questions were generated.</p>;
  }

  return (
    <ol className="space-y-3">
      {questions.map((question, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-medium tabular-nums">
            {i + 1}
          </span>
          <p className="pt-px leading-relaxed">{question}</p>
        </li>
      ))}
    </ol>
  );
}

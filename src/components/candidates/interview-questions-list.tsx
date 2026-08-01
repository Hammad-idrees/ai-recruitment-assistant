export function InterviewQuestionsList({ questions }: { questions: string[] }) {
  if (questions.length === 0) {
    return <p className="text-base text-white/50">No questions were generated.</p>;
  }

  return (
    <ol className="space-y-4">
      {questions.map((question, i) => (
        <li key={i} className="flex gap-4 text-base">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-glow-amber/20 to-glow-blue/20 border border-white/10 text-xs font-semibold tabular-nums text-white">
            {i + 1}
          </span>
          <p className="pt-0.5 leading-relaxed text-white/80">{question}</p>
        </li>
      ))}
    </ol>
  );
}

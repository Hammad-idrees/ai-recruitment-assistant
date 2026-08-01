export function InterviewQuestionsList({ questions }: { questions: string[] }) {
  if (questions.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-base text-white/50">No questions were generated.</p>
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {questions.map((question, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-glow-amber/20 to-glow-blue/20 border border-white/10 text-sm font-bold tabular-nums text-white shadow-lg">
            {i + 1}
          </span>
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors duration-300">
            <p className="text-base leading-relaxed text-white/90">{question}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

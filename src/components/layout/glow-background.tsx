import { cn } from "@/lib/utils";

/**
 * Decorative-only ambient glow. Absolutely positioned — the parent must be
 * `relative` and this should be the first child, content stacked above it.
 */
export function GlowBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-32 left-1/4 size-125 -translate-x-1/2 rounded-full bg-glow-amber/20 blur-[140px]" />
      <div className="absolute -top-10 right-0 size-100 translate-x-1/3 rounded-full bg-glow-blue/15 blur-[140px]" />
    </div>
  );
}

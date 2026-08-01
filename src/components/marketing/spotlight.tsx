"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Soft radial glow that follows the cursor, revealed on hover. Pure CSS
 * custom properties updated on mousemove — no external dependency.
 */
export function Spotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current!.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current!.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("group/spotlight relative", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at var(--spot-x, 50%) var(--spot-y, 50%), oklch(0.75 0.17 55 / 8%), transparent 45%)",
        }}
      />
      {children}
    </div>
  );
}

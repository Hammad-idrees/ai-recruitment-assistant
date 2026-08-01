/**
 * Decorative-only ambient glow, pinned to the viewport (not scrolled, not
 * clipped by any page's own container). Rendered once in the root layout,
 * behind the header and all page content.
 */
export function GlowBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div className="absolute -top-10 left-0 size-40 -translate-x-1/3 rounded-full bg-glow-amber/20 blur-[100px]" />
      <div className="absolute -top-10 right-0 size-100 translate-x-1/3 rounded-full bg-glow-blue/15 blur-[140px]" />
    </div>
  );
}

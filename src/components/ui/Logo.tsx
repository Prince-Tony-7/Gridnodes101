import Link from "next/link";

/** Wordmark with a minimal 2×2 node-grid glyph. */
export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="GridNodes home">
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
        <rect x="2" y="2" width="8" height="8" rx="2" className="fill-accent" />
        <rect x="14" y="2" width="8" height="8" rx="2" className="fill-logic" />
        <rect x="2" y="14" width="8" height="8" rx="2" className="fill-logic/70" />
        <rect x="14" y="14" width="8" height="8" rx="2" className="fill-accent/70" />
        <path d="M10 6h4M6 10v4M18 10v4M10 18h4" className="stroke-fg-subtle" strokeWidth="1.5" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-fg">
        Grid<span className="text-accent-strong">Nodes</span>
      </span>
    </Link>
  );
}

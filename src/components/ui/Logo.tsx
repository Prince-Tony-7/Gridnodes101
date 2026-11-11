import Link from "next/link";

/** Wordmark: four coloured nodes wired together. */
export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2" aria-label="GridNodes home">
      <svg viewBox="0 0 32 32" className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" aria-hidden="true">
        <path d="M9 9h14M9 9v14M23 9v14M9 23h14" stroke="var(--color-ink)" strokeWidth="2.5" />
        <rect x="3" y="3" width="12" height="12" rx="3.5" fill="var(--color-coral)" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="17" y="3" width="12" height="12" rx="6" fill="var(--color-sun)" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="3" y="17" width="12" height="12" rx="6" fill="var(--color-sky)" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="17" y="17" width="12" height="12" rx="3.5" fill="var(--color-mint)" stroke="var(--color-ink)" strokeWidth="2" />
      </svg>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">gridnodes</span>
    </Link>
  );
}

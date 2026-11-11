import Link from "next/link";

/** Wordmark: four nodes wired into a grid. */
export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="GridNodes home">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--color-ink)" />
        <path d="M10 10h12M10 10v12M22 10v12M10 22h12" stroke="rgb(255 255 255 / 0.35)" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3.2" fill="var(--color-coral)" />
        <circle cx="22" cy="10" r="3.2" fill="var(--color-sun)" />
        <circle cx="10" cy="22" r="3.2" fill="var(--color-sky)" />
        <circle cx="22" cy="22" r="3.2" fill="var(--color-mint)" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-ink">GridNodes</span>
    </Link>
  );
}

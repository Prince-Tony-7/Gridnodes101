import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Small tinted label. Pass background + text colour classes (e.g. from `palette.ts`)
 * via `className`; they replace the neutral default rather than competing with it.
 */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        className ?? "bg-paper-deep text-ink-soft",
      )}
    >
      {children}
    </span>
  );
}

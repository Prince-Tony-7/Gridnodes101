import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small tinted label. Pass background/text classes (e.g. from `palette.ts`) via `className`. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-paper-deep px-2 py-0.5 text-xs font-medium whitespace-nowrap text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
